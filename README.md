# Text-to-Speech App - AWS Solutions Architecture

A serverless text-to-speech application demonstrating modern cloud architecture patterns using AWS services. Built as a solutions architecture showcase featuring event-driven processing, secure file handling, and scalable design.

## Solution Architecture

### High-Level Architecture Diagram
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React SPA     │───▶│  API Gateway     │───▶│  Lambda Function│
│  (CloudFront)   │    │  (REST API)      │    │   (Python 3.9)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│     S3 Bucket   │◀───│   Amazon Polly   │◀───│  Text Processing│
│  (Audio Storage)│    │ (Neural/Standard)│    │   & Validation  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Architecture Components

#### 1. **Frontend Layer (React SPA)**
- **Service**: Single Page Application hosted on S3/CloudFront
- **Purpose**: User interface and client-side logic
- **Key Features**:
  - Responsive React components
  - Real-time audio controls
  - Session-based history management
  - Client-side input validation

#### 2. **API Gateway (REST)**
- **Service**: AWS API Gateway
- **Purpose**: API management and request routing
- **Configuration**:
  - REST API with CORS enabled
  - Request/response transformation
  - Throttling and rate limiting
  - CloudWatch integration for monitoring

#### 3. **Compute Layer (Serverless)**
- **Service**: AWS Lambda Function
- **Runtime**: Python 3.9
- **Purpose**: Business logic and orchestration
- **Responsibilities**:
  - Input validation and sanitization
  - SSML markup generation
  - AWS service integration
  - Error handling and logging

#### 4. **AI/ML Service (Text-to-Speech)**
- **Service**: Amazon Polly
- **Purpose**: Neural and standard voice synthesis
- **Features**:
  - Multiple voice options (6 voices)
  - SSML support for speech control
  - Variable speed processing
  - High-quality audio generation

#### 5. **Storage Layer (Object Storage)**
- **Service**: Amazon S3
- **Purpose**: Temporary audio file storage
- **Security**:
  - Presigned URLs for secure access
  - Time-limited access (1-hour expiration)
  - Automatic cleanup policies
  - CORS configuration for web access

## Architectural Patterns & Best Practices

### 1. **Serverless Architecture**
- **Event-driven processing** with Lambda functions
- **Pay-per-use** model with automatic scaling
- **No server management** required
- **Built-in high availability** across AZs

### 2. **Security Design**
- **Presigned URLs** for secure S3 access without exposing credentials
- **CORS policies** for secure cross-origin requests
- **IAM roles** with principle of least privilege
- **API Gateway throttling** to prevent abuse

### 3. **Scalability Patterns**
- **Horizontal scaling** through Lambda concurrency
- **Stateless design** for better performance
- **Asynchronous processing** for non-blocking operations
- **CDN distribution** for global content delivery

### 4. **Cost Optimization**
- **Serverless compute** reduces idle costs
- **S3 lifecycle policies** for automatic cleanup
- **Efficient resource allocation** based on usage patterns
- **Pay-per-request** pricing model

## AWS Services Integration

### Service Communication Flow
1. **User Request** → React SPA validates input and sends POST request
2. **API Gateway** → Receives request, applies CORS, forwards to Lambda
3. **Lambda Function** → Processes request, validates text, generates SSML
4. **Amazon Polly** → Synthesizes speech using neural/standard engines
5. **S3 Storage** → Stores audio file with metadata and security policies
6. **Response** → Returns presigned URL and metadata to client

### IAM Roles & Permissions

#### Lambda Execution Role
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "polly:SynthesizeSpeech"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow", 
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream", 
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

### S3 Bucket Configuration

#### CORS Policy
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

#### Lifecycle Policy (Cost Optimization)
```json
{
  "Rules": [
    {
      "Status": "Enabled",
      "Filter": {"Prefix": "audio_"},
      "Expiration": {"Days": 1}
    }
  ]
}
```

## Infrastructure as Code

### CloudFormation Template Structure
```yaml
Resources:
  # S3 Bucket for audio storage
  AudioStorageBucket:
    Type: AWS::S3::Bucket
    Properties:
      CorsConfiguration: ...
      LifecycleConfiguration: ...
      
  # Lambda Function
  TextToSpeechFunction:
    Type: AWS::Lambda::Function
    Properties:
      Runtime: python3.9
      Handler: lambda_function.lambda_handler
      Environment:
        Variables:
          S3_BUCKET: !Ref AudioStorageBucket
          
  # API Gateway
  TextToSpeechAPI:
    Type: AWS::ApiGateway::RestApi
    Properties:
      EndpointConfiguration:
        Types: [REGIONAL]
        
  # IAM Role
  LambdaExecutionRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument: ...
      Policies: ...
```

## Technical Implementation Details

### Lambda Function Architecture
- **Memory**: 512 MB (optimized for Polly processing)
- **Timeout**: 30 seconds (accommodates large text processing)
- **Environment Variables**: S3_BUCKET for configuration
- **Error Handling**: Comprehensive try-catch with CloudWatch logging
- **Response Format**: Standardized JSON with CORS headers

### API Gateway Configuration
- **Endpoint Type**: Regional for optimal latency
- **CORS**: Enabled for browser compatibility
- **Integration**: Lambda Proxy integration
- **Error Responses**: Custom error mappings
- **Monitoring**: CloudWatch metrics enabled

### Security Considerations
- **No hardcoded credentials** in application code
- **Presigned URLs** limit access time and scope
- **Input validation** prevents injection attacks
- **Rate limiting** through API Gateway throttling
- **VPC isolation** not required due to managed services

## Deployment Architecture

### Multi-Environment Strategy
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Development │    │   Staging   │    │ Production  │
│             │    │             │    │             │
│ • Manual    │    │ • CI/CD     │    │ • Blue/Green│
│ • Local S3  │    │ • Automated │    │ • Multi-AZ  │
│ • Basic     │    │ • Testing   │    │ • Enhanced  │
│   Monitoring│    │   Suite     │    │   Monitoring│
└─────────────┘    └─────────────┘    └─────────────┘
```

### Monitoring & Observability

#### CloudWatch Metrics
- **Lambda**: Duration, Error Rate, Invocations, Memory Usage
- **API Gateway**: Request Count, Latency, 4xx/5xx Errors
- **S3**: Request Count, Data Transfer, Storage Usage
- **Polly**: Character Count, Synthesis Requests

#### Logging Strategy
- **Lambda Logs**: Structured JSON logging with correlation IDs
- **API Gateway Logs**: Request/response logging for debugging
- **CloudTrail**: API call auditing for security compliance

### Performance Optimization

#### Cold Start Mitigation
- **Provisioned Concurrency** for consistent response times
- **Warm-up Scheduling** using CloudWatch Events
- **Lightweight Dependencies** to reduce package size
- **Connection Reuse** for AWS service clients

#### Caching Strategy
- **CloudFront CDN** for static React assets
- **API Gateway Caching** for repeated requests
- **Client-Side Caching** for audio files and metadata

## Business Logic Flow

### Request Processing Pipeline
```python
def lambda_handler(event, context):
    """
    1. Input Validation
       ├── Text length check (≤ 5000 chars)
       ├── Voice ID validation
       └── Speed parameter validation
       
    2. Text Processing
       ├── SSML markup generation
       ├── Prosody tag insertion
       └── Character escaping
       
    3. Polly Integration
       ├── Engine selection (Neural/Standard)
       ├── Voice synthesis request
       └── Audio stream handling
       
    4. S3 Storage
       ├── Unique filename generation
       ├── Metadata attachment
       └── Presigned URL creation
       
    5. Response Assembly
       ├── Success/error formatting
       ├── CORS header addition
       └── Structured JSON response
    """
```

### Error Handling Strategy
- **Input Validation Errors**: 400 Bad Request with detailed messages
- **Service Limit Errors**: 429 Too Many Requests with retry headers
- **AWS Service Errors**: 500 Internal Server Error with correlation ID
- **Timeout Errors**: 504 Gateway Timeout with retry guidance

## Scalability Considerations

### Auto-Scaling Capabilities
- **Lambda Concurrency**: Up to 1000 concurrent executions (default)
- **API Gateway**: Built-in auto-scaling with no limits
- **S3 Storage**: Virtually unlimited storage capacity
- **Polly Service**: Regional quotas with burst capability

### Cost Management
```
Cost Factors:
├── Lambda Execution Time: $0.0000166667 per GB-second
├── API Gateway Requests: $3.50 per million requests  
├── S3 Storage: $0.023 per GB (first 50TB)
├── S3 Requests: $0.0004 per 1,000 PUT requests
└── Polly Characters: $4.00 per 1 million characters
```

### Regional Deployment
- **Primary Region**: us-east-1 (N. Virginia)
- **Backup Region**: us-west-2 (Oregon) 
- **CDN**: Global CloudFront distribution
- **Data Residency**: S3 cross-region replication available

## Infrastructure Deployment

### Prerequisites
- AWS CLI configured with appropriate IAM permissions
- Terraform >= 1.0 installed
- Node.js 14+ and npm installed
- Basic understanding of AWS services

### Terraform Deployment (Recommended)

#### 1. **Prepare Lambda Package**
```bash
cd lambda_package
zip -r ../lambda_package.zip .
cd ..
```

#### 2. **Initialize Terraform**
```bash
terraform init
```

#### 3. **Plan Deployment**
```bash
terraform plan -var="environment=dev" -var="project_name=my-tts-app"
```

#### 4. **Deploy Infrastructure**
```bash
terraform apply -var="environment=dev" -var="project_name=my-tts-app"
```

#### 5. **Deploy React Frontend**
```bash
npm run build
aws s3 sync build/ s3://$(terraform output -raw frontend_bucket_name) --delete
```

#### 6. **Update Frontend Configuration**
```javascript
// Update API_ENDPOINT in src/App.js with Terraform output
const API_ENDPOINT = '$(terraform output -raw api_gateway_url)/convert';
```

### Terraform Configuration

The Terraform template creates:
- **S3 Buckets**: Audio storage with lifecycle policies, frontend hosting
- **Lambda Function**: Python 3.13 runtime with 512MB memory, 30s timeout
- **API Gateway**: Regional endpoint with CORS enabled
- **IAM Roles**: Least privilege access for Lambda execution
- **CloudWatch**: Log groups for monitoring and debugging

### Environment Variables
```hcl
variable "environment" {
  description = "Environment name (dev/staging/prod)"
  default     = "dev"
}

variable "project_name" {
  description = "Project name prefix for resources"
  default     = "text-to-speech-app"
}

variable "aws_region" {
  description = "AWS deployment region"
  default     = "us-east-1"
}
```

### Alternative: CloudFormation Deployment

For teams preferring CloudFormation:

#### 1. **Deploy Stack**
```bash
aws cloudformation deploy \
  --template-file cloudformation-template.yaml \
  --stack-name text-to-speech-app \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides Environment=prod
```

#### 2. **Update Lambda Code**
```bash
aws lambda update-function-code \
  --function-name text_to_speech \
  --zip-file fileb://lambda_package.zip
```

### Post-Deployment Verification

#### 1. **Test API Endpoint**
```bash
curl -X POST $(terraform output -raw api_gateway_url)/convert \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","voice":"Joanna","speed":"medium"}'
```

#### 2. **Verify S3 Bucket Access**
```bash
aws s3 ls $(terraform output -raw audio_storage_bucket_name)
aws s3 ls $(terraform output -raw frontend_bucket_name)
```

#### 3. **Check Lambda Logs**
```bash
aws logs tail /aws/lambda/$(terraform output -raw lambda_function_name) --follow
```

### Cleanup Resources
```bash
# Remove frontend files
aws s3 rm s3://$(terraform output -raw frontend_bucket_name) --recursive

# Destroy infrastructure
terraform destroy -var="environment=dev" -var="project_name=my-tts-app"
```

## API Reference

### POST /convert

**Request Body:**
```json
{
  "text": "Your text here",
  "voice": "Joanna",
  "speed": "medium",
  "language": "en-US"
}
```

**Response:**
```json
{
  "conversion_id": "uuid",
  "audioUrl": "presigned-s3-url",
  "voice_id": "Joanna", 
  "text_length": 100,
  "speed_rate": "medium",
  "language": "en-US",
  "expires_in": 3600,
  "timestamp": "2025-01-01T00:00:00"
}
```

## AWS Configuration

### Lambda Function
- Runtime: Python 3.9+
- Memory: 512MB (recommended)
- Timeout: 30 seconds
- Environment: `S3_BUCKET=your-bucket-name`

### IAM Permissions
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "polly:SynthesizeSpeech",
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "*"
    }
  ]
}
```

### S3 Bucket
- Enable CORS for web access
- Set lifecycle policy for automatic cleanup
- Configure appropriate bucket policies

## Project Structure

```
├── lambda_package/
│   └── lambda_function.py      # AWS Lambda backend
├── src/
│   ├── App.js                  # Main React component  
│   └── App.css                 # Stylesheet
├── package.json                # Dependencies
└── README.md                   # This file
```

## Technologies Used

- **Frontend**: React, Lucide React, CSS3
- **Backend**: Python, AWS Lambda, Boto3
- **Services**: AWS Polly, S3, API Gateway
- **Audio**: HTML5 Audio API

## Troubleshooting

### Common Issues

**No audio output**
- Verify API endpoint URL in `App.js`
- Check CORS configuration on API Gateway
- Ensure Lambda function has proper permissions

**Conversion fails**
- Check text length (max 5,000 characters)
- Verify AWS credentials and permissions
- Check CloudWatch logs for Lambda errors

**Download not working**
- Ensure S3 bucket allows public read access for presigned URLs
- Check browser's download permissions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review AWS CloudWatch logs for backend issues
- Open an issue in the repository