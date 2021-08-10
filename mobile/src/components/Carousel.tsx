import React, { useState, useRef } from 'react';
import { Image, Modal, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Video } from 'expo-av';
import Carousel from 'react-native-snap-carousel';
import ImageViewer from 'react-native-image-zoom-viewer';

import { IMidia } from '../constants/interfaces';
import styles, { SLIDER_WIDTH, ITEM_WIDTH } from '../styles/components/Carousel';
import globalStyles from '../styles/Global';

const CarouselItems = ({ midias }: { midias: IMidia[] }) => {

    const isCarousel = useRef(null);
    const video = useRef(null);
    const [status, setStatus] = useState({ isPlaying: false });
    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(0);

    const CarouselCardItem = ({ item, index }: { item: IMidia, index: number }) => {
        if (item.tipo === 'FOTO') {
            return (
                <View style={ styles.carouselContainer } key={ index }>
                    <TouchableOpacity onPress={() => { setVisible(true); setIndex(index) }} activeOpacity={1}>
                        <Image
                            source={{ uri: item.path }}
                            style={ styles.carouselImage }
                        />
                    </TouchableOpacity>
                </View>
            )
        } else if (item.tipo === 'VIDEO') {
            return (
                <View key={ index }>
                    <Video
                        ref={ video }
                        style={ styles.carouselVideo }
                        source={{ uri: item.path }}
                        useNativeControls
                        resizeMode='contain'
                        isLooping
                        onPlaybackStatusUpdate={() => setStatus({ isPlaying: !status.isPlaying })}

                    />
                </View>)
        }
        return (
            <View style={ styles.carouselContainer } key={ index }>
                <Image
                    source={{}}
                    style={ styles.carouselImage }
                />
            </View>
        )

    }

    const ImagesZoom = () => {
        let imgs: { url: string, props: any }[] = []
        for (var key in midias) {
            if (midias[key].tipo === 'FOTO')
                imgs.push({ url: midias[key].path, props: {} })
        }
        return (
            <Modal
                visible={ visible }
                transparent={ true }
                onRequestClose={() => setVisible(!visible)}
            >
                <TouchableOpacity style={ globalStyles.closeButton }
                    onPress={() => setVisible(!visible)}
                >
                    <AntDesign name='close' size={20} color='white' />
                </TouchableOpacity>
                <ImageViewer
                    imageUrls={ imgs }
                    onSwipeDown={() => setVisible(!visible)}
                    enableSwipeDown={true}
                    index={ index }
                    onChange={() => setIndex(index)}
                />
            </Modal >
        )
    }

    const videoStatus = (ind: number) => {
        if (midias[ind].tipo === 'VIDEO') {
            setStatus({ isPlaying: true })
            video.current?.playAsync()
        } else {
            setStatus({ isPlaying: false })
            video.current?.pauseAsync()
        }
    }

    return (
        <View style={{ alignItems: 'center' }}>
            <Carousel
                layout='default'
                layoutCardOffset={9}
                ref={ isCarousel }
                data={ midias.sort((a, b) => a.id - b.id) }
                renderItem={ CarouselCardItem }
                sliderWidth={ SLIDER_WIDTH }
                itemWidth={ ITEM_WIDTH }
                inactiveSlideShift={0}
                useScrollView={ true }
                onSnapToItem={(ind) => { videoStatus(ind) }}
            />
            <ImagesZoom />
        </View>
    )


}

export default CarouselItems;