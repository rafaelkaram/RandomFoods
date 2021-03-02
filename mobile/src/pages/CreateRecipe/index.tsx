import React, { useState } from 'react';
import { Button, View } from 'react-native';
import { Constants } from 'expo';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker'

const CreateRecipe = () => {

    const [imagePicked, setImagePicked] = useState({
        image: null,
        uploading: false
    });

    async function pickImage(image: any) {
        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: false,
            });

            handleImagePicked(pickerResult);
        }
    };
    async function handleImagePicked(pickerResult: any) {
        let uploadResponse, uploadResult;
        try {
            setImagePicked({
                image: null,
                uploading: true
            })
            if (!pickerResult.cancelled) {
                uploadResponse = await uploadImageAsync(pickerResult.uri);
                uploadResult = await uploadResponse.json();

                setImagePicked({
                    image: uploadResult.location,
                    uploading: true
                })
            }

        } catch (error) {
            console.log({ uploadResponse });
            console.log({ uploadResult });
            console.log({ error });
            alert('Upload failed, sorry :(');
        } finally {
            setImagePicked({
                image: null,
                uploading: false
            })
        }
    }


    async function uploadImageAsync(uri: any) {
        let apiUrl = 'http://192.168.1.102/uploads/receita';
        let uriParts = uri.split('.');
        let fileType = uriParts[uriParts.length - 1];

        let formData = new FormData();
        formData.append('photo', JSON.stringify({
            uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
        }));

        let options = {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        };

        return fetch(apiUrl, options);
    }

    return (
        <View>
            <Button
                title="Upload Image"
                onPress={() => pickImage(this)}
            />
        </View>
    )
}

export default CreateRecipe;