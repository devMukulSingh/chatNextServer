import axios from "axios";
import { getObjectURL, putObject } from "../aws";
import multer from "multer";

interface IgetProfileImageUrlFromAwsArgs{
  contentType:string,
  fileName:string,
  key:string,
  Body: Buffer | undefined
}

export const getProfileImageUrlFromAws = async ({ contentType, fileName, key, Body }: IgetProfileImageUrlFromAwsArgs)  => {

  const url = await putObject({
    key,
    contentType,
    Body
  }); 

  return key;
};
