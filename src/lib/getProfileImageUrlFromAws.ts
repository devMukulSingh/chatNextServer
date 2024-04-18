import axios from "axios";
import { getObjectURL, putObject } from "../aws";


export  const getProfileImageUrlFromAws = async(profileImage:any) => {
    const contentType = profileImage.mimetype || "";
    const filename = profileImage?.filename || "";
    const key = `uploads/profileImages/${Date.now()}-${filename}`;
    const url = await putObject({
        key,
        contentType,
    });
    await axios.put(url, profileImage.buffer,{
        headers: {
            "Content-Type": contentType
        }
    });
    const imageUrl = await getObjectURL(key);
    return imageUrl;
}