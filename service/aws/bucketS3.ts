import AWS, { S3 } from "aws-sdk";

const BUCKET_NAME = process.env.BUCKET_NAME;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const uploadFile = async (
  file: any,
  fileName: string
): Promise<S3.ManagedUpload.SendData> => {
  const params = {
    Bucket: BUCKET_NAME || "",
    Key: fileName,
    Body: file.buffer,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, function (err: any, data: any) {
      if (err) {
        reject(err.stack);
      } else {
        resolve(data);
      }
    });
  });
};

const deleteContentDirectory = (
  content: any[],
  objectToDelete: "croppedImage" | "defaultSource"
) => {
  content.forEach((item) => {
    if (item.Key.split("/")[1].split("_")[0] === objectToDelete) {
      s3.deleteObject(
        { Bucket: BUCKET_NAME || "", Key: item.Key },
        function (err) {
          if (err) console.log(err);
        }
      );
    }
  });
};

const checkBucketFolderExist = (
  folderName: string
): Promise<S3.Types.ListObjectsV2Output | null> => {
  const params = { Bucket: BUCKET_NAME || "", Prefix: folderName };
  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        if (data.KeyCount && data.KeyCount > 0) {
          resolve(data);
        } else resolve(null);
      }
    });
  });
};

export const uploadImageProfile = async (
  folderName: string,
  file: any,
  fileName: string,
  key: "croppedImage" | "defaultSource"
) => {
  try {
    const directory = await checkBucketFolderExist(folderName);

    if (directory?.Contents) {
      deleteContentDirectory(directory.Contents, key);
    }

    return await uploadFile(file, folderName + "/" + fileName);
  } catch (error) {
    throw error;
  }
};
