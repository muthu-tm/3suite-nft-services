"use strict";

import AWS from 'aws-sdk';
import Environment from "./../environment.js";
let aws_config = Environment.config.get("aws");
let aws_s3_config = Environment.config.get("aws_s3");

AWS.config.update({
  credentials: {
    accessKeyId: aws_config["access_key_id"],
    secretAccessKey: aws_config["secret_access_key"],
  },
});

const s3 = new AWS.S3({
  region: "us-east-1",
});

class AWSUtil {
  get s3() {
    return s3;
  }

  async upload_file(content, fileName, type) {
    try {
      let s3_bucket = aws_s3_config["bucket_name"];
      const uploadedImage = await s3
        .upload({
          Bucket: s3_bucket,
          ACL: "public-read",
          ContentType: type,
          Key: fileName + `.` + type,
          Body: content,
        })
        .promise();
      return uploadedImage;
    } catch (err) {
      console.log(err);
    }
  }
}

export default new AWSUtil();
