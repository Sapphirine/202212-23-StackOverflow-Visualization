# 202212-23-StackOverflow-Visualization

## StackOverflow Live Data Visualization and Analysis

To get started with the project, the first thing to know is that the data is retrieved using a PySpark Streaming service that is set up on Dataproc Cluster on Google Cloud.

The first step, therefore, is to create a new Dataproc Cluster on GCP. Make sure to allow Jupyter notebook access during this stage.
Once a Dataproc Cluster has been created, activate the Google BigQuery API. In the Google BigQuery API, a new dataset needs to be created for each of the two data types (one for the question tags & count, the other for the question titles & quality prediction)
