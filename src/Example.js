import React from 'react';
import {
  View,
  Image,
  Animated,
  Button,
  Slider,
  Text
} from 'react-native';
import SpriteSheet from './SpriteSheet';

export default class Example extends React.Component {
  state = {
    size: 100
  }

  fps = 24

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <SpriteSheet
            ref={ref => this.mummy = ref}
            // source={require('./assets/mummy.png')}
            source={require('./assets/bigMummy.png')}
            columns={5}
            rows={4}
            height={this.state.size} // set either, none, but not both
            // width={200}
            animations={{
              walk: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
              backwards: [17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
            }}
          />
        </View>
        <View style={{ paddingVertical: 30, paddingHorizontal: 30 }}>
          <Button
            onPress={this.play}
            title="play"
          />
          <Button
            onPress={this.loop}
            title="loop"
          />
          <Button
            onPress={this.stop}
            title="stop"
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, marginRight: 10 }}>FPS</Text>
            <Slider
              style={{ flex: 1 }}
              minimumValue={1}
              maximumValue={47}
              value={this.fps}
              onValueChange={val => this.fps = val}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, marginRight: 10 }}>Size</Text>
            <Slider
              style={{ flex: 1 }}
              minimumValue={10}
              maximumValue={300}
              value={155}
              onValueChange={val => this.setState({ size: val })}
            />
          </View>
        </View>
      </View>
    );
  }

  play = () => {
    this.mummy.play('walk', this.fps);
  }

  loop = () => {
    this.mummy.play('walk', this.fps, true);
  }

  stop = () => {
    this.mummy.stop(() => console.log('stopped'));
  }
}
