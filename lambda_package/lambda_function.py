import json
import boto3
import os
import base64
import uuid
from datetime import datetime, timedelta
import logging
import time

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

polly = boto3.client('polly')
s3 = boto3.client('s3')

S3_BUCKET = os.environ['S3_BUCKET']

def lambda_handler(event, context):
    """
    Lambda function to convert text to speech using Amazon Polly
    """
    try:
        # Parse the request body
        if 'body' in event:
            if event.get('isBase64Encoded', False):
                body = base64.b64decode(event['body']).decode('utf-8')
            else:
                body = event['body']
            request_data = json.loads(body)
        else:
            request_data = event

        # Extract the text, voice, speed_rate, and language from the request
        text = request_data.get('text', '')
        language = request_data.get('language', 'en-US')
        voice = request_data.get('voice', 'Joanna')
        speed_rate = request_data.get('speed', 'medium')

        # Validate the input
        if not text or len(text.strip()) == 0:
            return create_response(400, {'error': 'Text is required'})

        if len(text) > 5000:
            return create_response(400, {'error': 'Text is too long'})

        # Prepare SSML text with speech marks
        ssml_text = f'<speak><prosody rate="{speed_rate}">{text}</prosody></speak>'

        # Convert text to speech using Amazon Polly
        response = polly.synthesize_speech(
            Text=ssml_text,
            OutputFormat='mp3',
            VoiceId=voice,
            TextType='ssml',
            LanguageCode=language,
            Engine='neural' if voice not in ['Joanna', 'Matthew', 'Ivy', 'Kevin'] else 'standard'
        )

        # Generate a unique conversion ID
        conversion_id = str(uuid.uuid4())

        # Generate S3 key
        s3_key = f'audio_{conversion_id}.mp3'

        # Upload the audio file to S3
        s3.put_object(
            Bucket=S3_BUCKET,
            Key=s3_key,
            Body=response['AudioStream'].read(),
            ContentType='audio/mpeg',
            CacheControl='no-cache',
            Metadata={
                'conversion_id': conversion_id,
                'text_length': str(len(text)),
                'voice': voice
            }
        )

        # Set expiration time (e.g., 15 minutes = 900 seconds)
        expires_in = 3600
        logger.info(f"Generating presigned URL with ExpiresIn={expires_in} seconds")

        # Generate presigned URL for the audio file
        url = s3.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': S3_BUCKET,
                'Key': s3_key
            },
            ExpiresIn=expires_in
        )

        # Log the generated URL for debugging
        logger.info(f"Generated presigned URL: {url}")

        return create_response(200, {
            'conversion_id': conversion_id,
            'audioUrl': url,
            'voice_id': voice,
            'text_length': len(text),
            'speed_rate' : speed_rate,
            'language': language,
            'expires_in': expires_in,
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f"Error occurred: {str(e)}")
        return create_response(500, {'error': str(e)})

def create_response(status_code, body):
    """
    Create HTTP response with CORS headers
    """
    response = {
        'statusCode': status_code,
        'body': body,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Content-Type': 'application/json'
        }
    }
    return response