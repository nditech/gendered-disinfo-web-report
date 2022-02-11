# Report: State-Based Gendered Disinformation in Brazil & Lebanon

Web-based report built using D3.js for data visualizations, and the Svelte framework.


## Building the Report

1. Install the following softwares,

    - [git](https://github.com/git-guides/install-git)
    - [node.js & npm](https://nodejs.org/en/download/)


2. Open a terminal and run the following command to clone this repository on your machine,

        git clone https://github.com/nditech/gendered-disinfo-web-report.git


3. With the cloned repository as your current working directory, install the dependencies by running the command,

        npm i 

4. Edit the parameters of the report in the [config file](./src/config.json)

5. Build the report by running the command,

        npm run build

6. Launch a web server serving the report by running the command, 

        npm start

7. Open your browser and enter the following URL in the address bar to see the report,

        localhost:5555


## To deploy to S3

Here are the instructions to host the website inside an AWS S3 bucket.

1. Go to your [AWS S3 console](https://s3.console.aws.amazon.com/)

2. Click on "Create bucket", set the name and region, and make sure "Block all public access" is unchecked. Then, click on "Create Bucket".

3. Click on your bucket and then click on the "Permissions" tab

4. Edit "Bucket policy" and paste the following policy while making sure to replace {bucket_name} with the name of your bucket:

        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "PublicRead",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": "arn:aws:s3:::{bucket_name}/*"
                }
            ]
        }

5. Click on "Save changes"

6. Click on the "Objects" tab and then click on "Upload"

7. Drag and drop all the content from the [public](./public/) folder of this repo and then click on "Upload"

8. Click on the "Properties" tab and scroll down to the "Static website hosting" section. Click on "Edit"

9. Enable Static website hosting, and set "index.html" as the Index document. Click on "Save changes"

10. Make sure everything works by clicking on the Bucket website endpoint


## To update the S3 deployment

1. Go to your [AWS S3 console](https://s3.console.aws.amazon.com/)

2. Click on your bucket

3. Click on the "Objects" tab and then click on "Upload"

4. Drag and drop all the content from the [public](./public/) folder of this repo and then click on "Upload"


## Google Analytics

To monitor the viewership of the website you can add a Google Analytcs tracker. 

1. Create a [Google Analytics](https://analytics.google.com/analytics/web/provision/#/provision) account

2. On the "Admin" page, navigate to "Data Streams" and select "Web"

3. Create a new stream using the URL of your website

4. Copy the "MEASUREMENT ID" and paste it into the [config file](./src/config.json),

        "GOOGLE_ANALYTICS_ID": "G-005X6Y4G5M"

5. Rebuild the report, 

        npm run build
        

## Updating the PGP key

Viewers might want to reach out by email. They can encrypt their message using the PGP public key displayed at 
the bottom of the page. 

Many tools are available to generate a new public/private key pair, encrypt a message using the public key, and 
decrypt the message using the private key. 

For testing purposes, you can use the online [pgptool](https://pgptool.org/). 

Save the public key inside the [files](./public/assets/files/pgp.pub.txt) subdirectory of the public folder.


## To serve through Tor

To serve your website through Tor, you will need your own linux server. 

1. Install Tor,

        sudo apt update
        sudo apt install tor


2. Uncomment these two lines in the config file /etc/tor/torrc

        HiddenServiceDir /var/lib/tor/hidden_service/
        HiddenServicePort 80 127.0.0.1:80

3. Get the Onion address of your server by running

        sudo cat /var/lib/tor/hidden_service/hostname

4. You should get something that looks like,

        en5kq3sxdasdabd212aoisdtrsblbaznpk4ljqd.onion

5. In the [config file](./src/config.json) set ENABLE to true and paste your address,

        "TOR": {
                "ENABLE": false,
                "ONION_ADDRESS": "http://ADDR.onion"
        },

6. Rebuild the report, 

        npm run build
