from google.cloud import bigquery
from google.oauth2 import service_account
import pandas as pd
import time

credentials = service_account.Credentials.from_service_account_file('/path/to/json/for/GCPBigQueryAccess')

project_id = 'project-name-in-gcp'
client = bigquery.Client(credentials= credentials, project=project_id)

while True:
    query_job = client.query("""
    SELECT *
    FROM project-ID-dataset.table_name
    LIMIT 1000 """)

    print("Retrieving data from big query ......")
    results = query_job.to_dataframe() # Wait for the job to complete.

    results.to_csv("bigquery_data.csv")
    print("Data saved to csv successfully! ")
    time.sleep(10)
