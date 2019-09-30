import React, {Component} from 'react';
import {Animated, Dimensions, Easing, Image, StyleSheet, View} from 'react-native';
import Sound from 'react-native-sound';
import { NavigationActions, StackActions } from 'react-navigation';

const {height, width} = Dimensions.get('window');

export default class SplashScreen extends Component {

    static navigationOptions = {
        header: null
    };

    mySound;

    constructor(props) {
        super(props);
        this.anim = new Animated.Value(1);
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.animate();
        this.playSound();
        setTimeout(() => {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'FoldersList' })],
            });
            navigation.dispatch(resetAction);
        }, 2000);
    }

    componentWillUnmount() {
        this.mySound.pause();
        this.mySound.stop();
        this.mySound.release();
    }

    playSound = () => {
        Sound.setCategory('Playback');
        this.mySound = new Sound('my_sound.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                return;
            }
            this.mySound.play();
        });
    };

    animate() {
        this.anim.setValue(0);
        Animated.timing(this.anim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            isInteraction: false
        }).start(this.animate.bind(this));
    }

    render() {

        const size = width / 4,
            pulseMaxSize = width / 2,
            backgroundColor = '#000000';

        return (
            <View style={[styles.circleWrapper, {
                width: pulseMaxSize,
                height: pulseMaxSize,
                marginLeft: -pulseMaxSize / 2,
                marginTop: -pulseMaxSize / 2,
            }]}>
                <Animated.View
                    style={[styles.circle, {
                        backgroundColor,
                        width: this.anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [size, pulseMaxSize]
                        }),
                        height: this.anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [size, pulseMaxSize]
                        }),
                        borderRadius: pulseMaxSize / 2,
                        opacity: this.anim.interpolate({
                            inputRange: [0.1, 0.6],
                            outputRange: [0.6, 0.1]
                        })
                    }]}
                />
                <Image
                    source={require('../../images/front-icon.png')}
                    style={[styles.image, {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                    }]}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    circleWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: width / 2,
        top: height / 2,
    },
    image: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        position: 'absolute'
    }
});