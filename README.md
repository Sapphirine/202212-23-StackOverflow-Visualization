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
To get the prediction on question quality, a trained model is needed. A keras model was trained and the results can be seen in the "Bi-LSTM" folder. The trained model weights are linked in the same folder as well. *Columbia University affiliates will have access to this file. Please let us know if you require access to the weights and we will try our best to help you out.* Add the trained model to the same directory as your jupyter notebook to load it.

The next stage is the retrieval of this data to your local or virtual machine. This is achieved using the python scripts under "Data Retrieval from GBQ" folder.
These scripts are fairly simple but once again require some setup.

Firstly, you will need to get a Google BigQuery authentication key to be able to access the data. This can be done by following the first 5 steps at this [link](https://codelabs.developers.google.com/codelabs/cloud-bigquery-nodejs?fbclid=IwAR0yvS46R5eLX2E2Epyx8Tm9FOFfEEJQsezp9ihuuwBSEHA6VypSCCJYQJ4#3) which describes how to make IAM access using a service account. Once you have a "key.json" file, you will need it to access the data. Make sure to go into GCP IAM and change the Service Account roles to be **atleast** Admin for BigQuery and Viewer for Project. Without this, you will not be able to access the data.

Once this is complete, run the python scripts under the "Data Retrieval from GBQ" folder. This will get the data from GBQ and save it locally as ".csv" files. The current configuration in the script saves the files as "bigquery_data.csv" and "pred.csv" for the two scripts respectively. The script runs until interrupted. Example ".csv" files have also been added to the same folder in Github to confirm the data you are seeing is consistent with our intentions.

After the data is being captured, all that is left to do is to point the javascript files under the "Visualizations" folder to the path to your file. This will need to be changed at every d3.csv function as shown below:

```javascript
d3.csv("/path/to/file/.csv", function(error, data) {
  if (error) throw error;
```

If everything is done as described above, you will be able to visualize in Real Time the tags and the question quality of every question being asked on StackOverflow. To restart your project, simple clear your tables in Google BigQuery and restart all scripts.

The video below provides a brief overview of the project:
<a href="http://www.youtube.com/watch?feature=player_embedded&v=7jOH5gX1w9Q
" target="_blank"><img src="http://img.youtube.com/vi/7jOH5gX1w9Q/0.jpg" 
alt="IMAGE ALT TEXT HERE" width="1280" height="700" border="10" /></a>

Thank you for your for taking the time to read this. We appreciate you! 

Group 23

AF/KW/MSS
