import React from 'react';
import { SafeAreaView, View, Image, Animated, Button, Slider, Switch, Text } from 'react-native';
import SpriteSheet from 'rn-sprite-sheet';

export default class Example extends React.Component {
  state = {
    loop: false,
    resetAfterFinish: false
  };
  fps = 16;

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <SpriteSheet
            ref={ref => (this.mummy = ref)}
            source={require('./assets/mummy.png')}
            columns={9}
            rows={6}
            // height={200} // set either, none, but not both
            // width={200}
            imageStyle={{ marginTop: -1 }}
            animations={{
              walk: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
              appear: Array.from({ length: 15 }, (v, i) => i + 18),
              die: Array.from({ length: 21 }, (v, i) => i + 33)
            }}
          />
        </View>
        <View style={{ paddingVertical: 30, paddingHorizontal: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Button onPress={() => this.play('walk')} title="walk" />
            <Button onPress={() => this.play('appear')} title="appear" />
            <Button onPress={() => this.play('die')} title="die" />
            <Button onPress={this.stop} title="stop" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, marginRight: 10 }}>FPS</Text>
            <Slider
              style={{ flex: 1 }}
              minimumValue={1}
              maximumValue={47}
              value={this.fps}
              onValueChange={val => (this.fps = val)}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, marginRight: 10 }}>Loop</Text>
            <Switch value={this.state.loop} onValueChange={loop => this.setState({ loop })} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, marginRight: 10 }}>Reset After Finish</Text>
            <Switch
              value={this.state.resetAfterFinish}
              onValueChange={val => this.setState({ resetAfterFinish: val })}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  play = type => {
    this.mummy.play({
      type,
      fps: this.fps,
      loop: this.state.loop,
      resetAfterFinish: this.state.resetAfterFinish,
      onFinish: () => console.log('hi')
    });
  };

  stop = () => {
    this.mummy.stop(() => console.log('stopped'));
  };
}
