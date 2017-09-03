import React from 'react';
import {
  View,
  Image,
  Animated,
  Easing
} from 'react-native';
import resolveAssetSource from 'resolveAssetSource';
import PropTypes from 'prop-types';

const stylePropTypes = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.object,
  PropTypes.array,
]);

export default class SpriteSheet extends React.Component {
  static propTypes = {
    source: PropTypes.number.isRequired,
    viewStyle: stylePropTypes,
    imageStyle: stylePropTypes,
    columns: PropTypes.number,
    rows: PropTypes.number,
    animations: PropTypes.object
  }

  static defaultPropTypes = {
    columns: 1,
    rows: 1,
    animations: {},
    interpolationRanges: {}
  }

  state = {
    imageHeight: 0,
    imageWidth: 0,
    defaultFrameHeight: 0,
    defaultFrameWidth: 0,
    topInputRange: [0, 1],
    topOutputRange: [0, 1],
    leftInputRange: [0, 1],
    leftOutputRange: [0, 1],
  }

  time = new Animated.Value(0)
  interpolationRanges = {}

  componentWillMount() {
    let { source, height, width, rows, columns } = this.props;

    let image = resolveAssetSource(source);

    this.setState({
      imageHeight: height ? height * rows : image.height,
      imageWidth: width ? width * columns : image.width,
      frameHeight: height || image.height / rows,
      frameWidth: width || image.width / columns
    }, this.generateInterpolationRanges);
  }


  render() {
    let {
      imageHeight,
      imageWidth,
      frameHeight,
      frameWidth,
      // topInputRange,
      // topOutputRange,
      // leftInputRange,
      // leftOutputRange,
      animationType
    } = this.state;
    let { viewStyle, imageStyle, rows, columns, height, width, source } = this.props;

    let { top = { in: [0, 0], out: [0, 0] }, left = { in: [0, 0], out: [0, 0] } } = this.interpolationRanges[animationType] || {};

    return (
      <View
        style={[
          viewStyle, {
          height: frameHeight,
          width: frameWidth,
          // overflow: 'hidden'
        }]}>
        <Animated.Image
          source={source}
          style={[
            imageStyle, {
            height: imageHeight,
            width: imageWidth,
            top: this.time.interpolate({
              inputRange: top.in, // topInputRange,
              outputRange: top.out, // topOutputRange
            }),
            left: this.time.interpolate({
              inputRange: left.in, // leftInputRange,
              outputRange: left.out, // leftOutputRange
            })
          }]}
        />
      </View>
    );
  }

  generateInterpolationRanges = () => {
    let { animations } = this.props;

    for (let key in animations) {
      let { length } = animations[key];
      let input = [].concat(...Array.from(Array(length).keys()).map(i => [i, i + 0.99999999999]));
      input.pop();

      this.interpolationRanges[key] = {
        top: {
          in: input,
          out: [].concat(...animations[key].map(i => {
            let { y } = this.getFrameCoords(i);
            return [y, y];
          })).slice(0, length * 2 - 1)
        },
        left: {
          in: input,
          out: [].concat(...animations[key].map(i => {
            let { x } = this.getFrameCoords(i);
            return [x, x];
          })).slice(0, length * 2 - 1)
        }
      };
    }
  }

  stop = cb => {
    this.time.stopAnimation(cb);
  }

  play = (type, fps, onFinish = () => {}) => {
    let { animations } = this.props;
    let { length } = animations[type];
    //
    // let topInputRange = [].concat(...Array.from(Array(length).keys()).map(i => [i, i + 0.99999999999]));
    // let topOutputRange = [].concat(...animations[type].map(i => {
    //   let { y } = this.getFrameCoords(i);
    //   return [y, y];
    // }));
    // let leftInputRange = [].concat(...Array.from(Array(length).keys()).map(i => [i, i + 0.99999999999]));
    // let leftOutputRange = [].concat(...animations[type].map(i => {
    //   let { x } = this.getFrameCoords(i);
    //   return [x, x];
    // }));
    //
    // topInputRange.pop();
    // topOutputRange.pop();
    // leftInputRange.pop();
    // leftOutputRange.pop();

    this.setState({
      // topInputRange,
      // topOutputRange,
      // leftInputRange,
      // leftOutputRange
      animationType: type
    }, () => {
      // Animated.loop();
      Animated.timing(this.time, {
        toValue: length - 1,
        duration: length / fps * 1000,
        easing: Easing.linear
      }).start(() => {
        this.time.setValue(0);

        onFinish();
      });
    })
  }

  getFrameCoords = i => {
    let { rows, columns } = this.props;
    let { frameHeight, frameWidth } = this.state;

    let successionWidth = i * frameWidth;

    return {
      x: -successionWidth % (columns * frameWidth),
      y: -Math.floor(successionWidth / (columns * frameWidth)) * frameHeight
    };
  }
}
