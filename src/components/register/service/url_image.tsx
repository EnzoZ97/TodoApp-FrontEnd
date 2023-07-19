import { storage } from '../../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export const geturl_image = async ( file : File ) => {
    const mountainsRef = ref(storage, `userImages/${uuidv4()}`); 
    await uploadBytes(mountainsRef, file).then((snapshot) => {
        //console.log('Uploaded a file!');
      }); 
    const url = await getDownloadURL(mountainsRef);
    return url;
}