# Report: State-Based Gendered Disinformation in Brazil & Lebanon


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


## Updating the PGP key

Viewers might want to reach out by email. They can encrypt their message using the PGP public key displayed at 
the bottom of the page. 

Many tools are available to generate a new public/private key pair, encrypt a message using the public key, and 
decrypt the message using the private key. 

For testing purposes, you can use the online [pgptool](https://pgptool.org/). 
