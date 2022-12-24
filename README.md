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

Once the tables and cluster have been set up as described, navigate to the code PySpark Socket and Receiver for tags folder and upload the two files to the jupyter notebook on the Dataproc cluster. The PySpark Socket file is responsible for fetching the data from StackOverflow every 10 seconds. Make sure you run the command below before running the "Python socket.ipynb" file. It has been included as the first cell for convenience.

```!pip install stackapi```

*To run the code over a longer period of time (or for more than 300 requests per day), an app/dev account must be registered with Stack Exchange API - if this step is skipped, remove the key parameter in the following code line:*
```python
SITE = StackAPI('stackoverflow', key='XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
```

If everything is run as described above, the "Python socket.ipynb" code will run and print:

```Waiting for TCP connection...```

This means that the socket is working correctly. Once the socket is working, we need to receive the data that the socket is ready to send. This is done using the other jupyter notebook file that - "PySpark Streaming.ipynb". Make sure to populate all variables prompting you to change them to their required values. You will need the your GCP Project ID, Cloud Storage bucket name, output dataset name and the output data table for the tags count data. Change the Port number if desired making sure that this needs to be changed on the socket side as well. Increase the streamtime once everything is working to continue gathering data.

Once all the variables have been populated, run the script. After establishing a Spark configuration, the script will proceed to connect to the socket, get the data that is sent from the socket, process it and then save it to its destination table and bucket.

This completes the data capture part. The same needs to be done for the question quality prediction data.

