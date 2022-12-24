# 202212-23-StackOverflow-Visualization

## StackOverflow Live Data Visualization and Analysis

To get started with the project, the first thing to know is that the data is retrieved using a PySpark Streaming service that is set up on Dataproc Cluster on Google Cloud.

The first step, therefore, is to create a new Dataproc Cluster on GCP. Make sure to allow Jupyter notebook access during this stage.
Once a Dataproc Cluster has been created, activate the Google BigQuery API. In the Google BigQuery API, a new dataset needs to be created and a table for each of the two data types should be added (one for the question tags & count, the other for the question titles & quality prediction). As an example, we used "tag_count" and "title_pred" as the table names.

Following the creation of the dataset & tables, create a Cloud Storage bucket on Google cloud as well - this will serve as backup storage. *This step isn't required but must be commented out in the PySpark Streaming script if this step is skipped*

The overall process requires two steps:
1. Gathering data for the tag counts
2. Gathering data for the title predictions

This example will go though the tag count data retrieval since the process for the title predictions data retrieval is also the same.

Once the tables and cluster have been set up as described, navigate to the code PySpark Socket and Receiver for tags folder and upload the two files to the jupyter notebook on the Dataproc cluster. The PySpark Socket file is responsible for fetching the data from StackOverflow every 10 seconds. Make sure you run the command below before running the "Python socket.ipynb" code. It has been included as the first cell for convenience.

```!pip install stackapi```

*To run the code over a longer period of time (or for more than 300 requests per day), an app/dev account must be registered with Stack Exchange API - if this step is skipped, remove the key parameter in the following code line:*
```python
SITE = StackAPI('stackoverflow', key='XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
```
