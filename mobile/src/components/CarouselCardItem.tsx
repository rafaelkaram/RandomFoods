import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, Image, Modal, Text } from "react-native"
import { IMidia } from '../constants/interfaces';
import Carousel from 'react-native-snap-carousel'
import { Video } from 'expo-av';
import VideoPlayer from 'expo-video-player'
import ImageViewer from 'react-native-image-zoom-viewer';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const SLIDER_WIDTH = Dimensions.get('window').width + 80
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const CarouselItems = ({ midias }: { midias: IMidia[] }) => {

    const isCarousel = React.useRef(null);
    const video = React.useRef(null);
    const [status, setStatus] = useState({ isPlaying: false })
    const [visible, setVisible] = useState(false)
    const [index, setIndex] = useState(0)

    const CarouselCardItem = ({ item, index }: { item: IMidia, index: number }) => {
        if (item.tipo === 'FOTO') {
            return (
                <View style={styles.container} key={index}>
                    <TouchableOpacity onPress={() => {setVisible(true); setIndex(index)}} activeOpacity={1}>
                        <Image
                            source={{ uri: item.path }}
                            style={styles.image}
                        />
                    </TouchableOpacity>
                </View>
            )
        } else if (item.tipo === 'VIDEO') {
            return (
                <View key={index}>
                    <VideoPlayer
                        videoProps={{
                            shouldPlay: true,
                            resizeMode: Video.RESIZE_MODE_CONTAIN,
                            source: {
                                uri: item.path,
                            },
                        }}
                        width={ITEM_WIDTH}
                        height={300}
                        inFullscreen={true}
                        showFullscreenButton={false}
                    />
                </View>)
        }
        return (
            <View style={styles.container} key={index}>
                <Image
                    source={{}}
                    style={styles.image}
                />
            </View>
        )

    }
    const ImagesZoom = () => {
        let imgs : { url: string, props: any }[] = []
        for (var key in midias){
            imgs.push({url: midias[key].path, props: {}})
        }
        return(
            <Modal visible={visible} transparent={true} >
                <ImageViewer 
                    imageUrls={imgs} 
                    onSwipeDown={() => setVisible(!visible)} 
                    enableSwipeDown={true} 
                    index={index}
                    onChange={() => setIndex(index)}
                />
            </Modal>
        )
    }
    
    return (
        <View style={{ alignItems: 'center' }}>
            <Carousel
                layout="default"
                layoutCardOffset={9}
                ref={isCarousel}
                data={midias.sort((a, b) => a.id - b.id)}
                renderItem={CarouselCardItem}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                inactiveSlideShift={0}
                useScrollView={true}
            />
            <ImagesZoom />
        </View>
    )


}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: ITEM_WIDTH,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        marginVertical: 10,
    },
    image: {
        width: ITEM_WIDTH,
        height: 300,
    },
    header: {
        color: "#222",
        fontSize: 28,
        fontWeight: "bold",
        paddingLeft: 20,
        paddingTop: 20
    },
    body: {
        color: "#222",
        fontSize: 18,
        paddingLeft: 20,
        paddingRight: 20
    },
    video: {
        alignSelf: 'center',
        width: ITEM_WIDTH,
        height: 300,
    },
})

export default CarouselItems