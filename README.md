# rn-sprite-sheet

A sprite sheet animation library for React Native

![demo](https://media.giphy.com/media/xjyRCqzjQhyoartPCq/giphy.gif)

### Install

`npm install --save rn-sprite-sheet`

### Import

`import SpriteSheet from 'rn-sprite-sheet';`

### Usage

1.  Create ref for SpriteSheet
2.  Set the source using `require()` for local asset images or using `{ uri: <image's url>, width: <image's width>, height: <image's height> }` for network images
3.  Specify the columns and rows (each frame must be the same size)
4.  Create animations object (each key is an animation name and their value should be an array of frame indexes)
5.  Play an animation by calling the play method on a SpriteSheet reference and pass it a config object with at least a type property

### Example

```javascript
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
/>;
// ...
play = config => this.mummy.play(config);
```

### Methods

_To be called on a SpriteSheet reference_

```javascript
play({
  type, // (required) name of the animation (name is specified as a key in the animation prop)
  fps = 24, // frames per second
  loop = false, // if true, replays animation after it finishes
  resetAfterFinish = false, // if true, the animation will reset back to the first frame when finished; else will remain on the last frame when finished
  onFinish = () => {} // called when the animation finishes; will not work when loop === true
})

stop(callback) // stop at current frame

reset(callback) // stop and go to first frame
```

### Props

```javascript
static propTypes = {
  source: PropTypes.number.isRequired, // source must be required; { uri } will not work
  columns: PropTypes.number.isRequired,
  rows: PropTypes.number.isRequired,
  animations: PropTypes.object.isRequired, // see example
  viewStyle: stylePropType, // styles for the sprite sheet container
  imageStyle: stylePropType, // styles for the sprite sheet
  height: PropTypes.number, // set either height, width, or none,
  width: PropTypes.number, // but not both height and width
  onLoad: PropTypes.func
};

static defaultPropTypes = {
  columns: 1,
  rows: 1,
  animations: {}
};
```
