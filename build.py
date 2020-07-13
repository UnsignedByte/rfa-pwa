# -*- coding: utf-8 -*-
# @Author: UnsignedByte
# @Date:   20:06:04, 06-Jun-2020
# @Last Modified by:   UnsignedByte
# @Last Modified time: 18:02:51, 12-Jul-2020

import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/drive.apps.readonly']
SERVICE_ACCOUNT_FILE = 'params/credentials.json'

credentials = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)

client = build('drive', 'v3', credentials=credentials)