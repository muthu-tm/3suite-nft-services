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
  region: "us-east-2",
});

class AWSUtil {
  get s3() {
    return s3;
  }

  async createPresignedS3URL(key) {
    let upload_timeout = aws_s3_config["upload_timeout"];
    let max_bytes_allowed = aws_s3_config["max_bytes_allowed"];
    let s3_bucket = aws_s3_config["bucket_name"];

    if (!upload_timeout) {
      upload_timeout = 1 * 30; // 30mins
    }

    if (!max_bytes_allowed) {
      max_bytes_allowed = 10 * 1024 * 1024; // 10mb
    }

    const params = {
      Exires: upload_timeout,
      Bucket: s3_bucket,
      Conditions: [
        { "acl": "public-read" },
        ["content-length-range", 100, max_bytes_allowed]  // 100byte - max_bytes_allowed
      ],
      Fields: {
        key,
      },
    };

    return new Promise(async (resolve, reject) => {
      s3.createPresignedPost(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(data);
      });
    });
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

export default AWSUtil;
