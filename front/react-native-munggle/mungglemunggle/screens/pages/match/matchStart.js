import React, { useRef, useState, useEffect } from 'react';
import { Animated, View, StyleSheet, PanResponder, Text, Image, Dimensions, TouchableOpacity } from 'react-native';

import profile from "../../../assets/icons/profile.png";
import end from "../../../assets/icons/end.png";
import back from '../../../assets/icons/back.png';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const Users = [
  {
      "dogId": 28,
      "kindId": 55,
      "birthDate": "2023-07-07T23:25:22",
      "size": "",
      "weight": 0.0,
      "gender": "",
      "isNeutering": true,
      "name": "초롱",
      "image": "https://image.msscdn.net/images/goods_img/20231006/3610548/3610548_17017424897248_500.jpg",
      "description": "스윗 리를 도그"
  },
  {
      "dogId": 43,
      "kindId": 55,
      "birthDate": "2023-07-07T23:25:22",
      "size": "",
      "weight": 0.0,
      "gender": "",
      "isNeutering": true,
      "name": "푸푸",
      "image": "https://image.msscdn.net/images/goods_img/20231006/3610548/3610548_17017424897248_500.jpg",
      "description": "스윗 리를 도그"
  },
  {
      "dogId": 53,
      "kindId": 55,
      "birthDate": "2023-07-07T23:25:22",
      "size": "",
      "weight": 0.0,
      "gender": "",
      "isNeutering": true,
      "name": "삼성",
      "image": "https://image.msscdn.net/images/goods_img/20231006/3610548/3610548_17017424897248_500.jpg",
      "description": "스윗 리를 도그"
  },
  {
      "dogId": 59,
      "kindId": 77,
      "birthDate": "2023-07-07T23:25:22",
      "size": "",
      "weight": 0.0,
      "gender": "",
      "isNeutering": true,
      "name": "핑크",
      "image": null,
      "description": "큩큩큩!"
  }
];

const DraggableBox = ({ index, image, panResponder, pan, size, weight, gender,
   isNeutering, name, description, onHeartPress, onBrokenHeartPress }) => (
  <Animated.View
    style={[
      styles.box,
      { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
    ]}
    {...panResponder.panHandlers}
  >
    <Image source={image ? {uri:image} : profile} style={styles.image} />
    <View style={styles.detail}>
      <Text style={styles.detailText}>{`이름: ${name}`}</Text>
      <Text style={styles.detailText}>{`사이즈: ${size}`}</Text>
      <Text style={styles.detailText}>{`몸무게: ${weight}`}</Text>
      <Text style={styles.detailText}>{`성별: ${gender}`}</Text>
      <Text style={styles.detailText}>{`중성화 여부: ${isNeutering}`}</Text>
      <Text style={styles.detailText}>{`설명: ${description}`}</Text>
      <View style={styles.heartBox}>
      <TouchableOpacity onPress={onBrokenHeartPress}>
          <Text style={styles.brokenHeartButton}>💔</Text>
        </TouchableOpacity>
      <TouchableOpacity onPress={onHeartPress}>
          <Text style={styles.heartButton}>❤️</Text>
        </TouchableOpacity>
        </View>
    </View>
  </Animated.View>
);


const initialPositions = Users.map(() => ({ x: 0, y: 0 })); 

export default function MatchStart () {
  const length = Users.length;
  const [cur,setCur] = useState(1);
  const navigation = useNavigation();
  const [boxes, setBoxes] = useState(Users.map(() => ({ pan: useRef(new Animated.ValueXY()).current })));
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); 

  const SWIPE_THRESHOLD = 120; //카드 사라지는 드래그 범위

  const createPanResponder = (index) =>
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (_, gestureState) => {
      initialPositions[index] = { x: boxes[index].pan.x._value, y: boxes[index].pan.y._value };
    },
    onPanResponderMove: (_, gestureState) => {
      // Using callback instead of Animated.event
      boxes[index].pan.x.setValue(gestureState.dx);
      boxes[index].pan.y.setValue(0);
    },
    onPanResponderRelease: (_, gestureState) => {
      // Reset the position to the initial position when the drag is released
      Animated.spring(boxes[index].pan, {
        toValue: { x: initialPositions[index].x, y: initialPositions[index].y },
        useNativeDriver: false,
      }).start();

      if (gestureState.dx < -SWIPE_THRESHOLD) {
        if(cur<length){
          setCur(cur+1);}
        setIsButtonDisabled(true);

        Animated.spring(boxes[index].pan, {
          toValue: { x: -1 * SCREEN_WIDTH, y: 0 },
          useNativeDriver: false,
        }).start(()=>{
          setBoxes((prevBoxes) => prevBoxes.filter((_, i) => i !== index));
          setIsButtonDisabled(false);
        });
      } else if (gestureState.dx > SWIPE_THRESHOLD) {
        if(cur<length){
          setCur(cur+1);}
        setIsButtonDisabled(true);

        Animated.spring(boxes[index].pan, {
          toValue: { x: SCREEN_WIDTH, y: 0 },
          useNativeDriver: false,
        }).start(()=>{
          setBoxes((prevBoxes) => prevBoxes.filter((_, i) => i !== index));
          setIsButtonDisabled(false);
        });
      }
    },
  });



  const onBrokenHeartPress = () => {
    if(cur<length){
      setCur(cur+1);}
    const index = boxes.length - 1;
    console.log(boxes.length)
    if (!isButtonDisabled && boxes.length > 0) {
      setIsButtonDisabled(true);
      Animated.spring(boxes[index].pan, {
        toValue: { x: -1 * SCREEN_WIDTH, y: 0 },
        useNativeDriver: false,
      }).start(() => {
        setBoxes((prevBoxes) => prevBoxes.filter((_, i) => i !== index));
        setIsButtonDisabled(false);
      });
    }
  };

  const onHeartPress = () => {
    if(cur<length){
      setCur(cur+1);}
    const index = boxes.length - 1;
    console.log(boxes.length)
    if (!isButtonDisabled && boxes.length > 0) {
      setIsButtonDisabled(true);
      Animated.spring(boxes[index].pan, {
        toValue: { x: SCREEN_WIDTH, y: 0 },
        useNativeDriver: false,
      }).start(() => {
        setBoxes((prevBoxes) => prevBoxes.filter((_, i) => i !== index));
        setIsButtonDisabled(false);
      });
    }
  };

  useEffect(() => {
    if (boxes.length === 0) {
      navigation.navigate('MatchResult');
    }
  }, [boxes.length]);



  return (
    <View style={styles.container}>
      {boxes.map((box, index) => (
        <DraggableBox
        key={Users[index].dogId}
        image={Users[index].image}
        size={Users[index].size}
        weight={Users[index].weight}
        gender={Users[index].gender}
        isNeutering={Users[index].isNeutering}
        name={Users[index].name}
        description={Users[index].description}
        panResponder={createPanResponder(index)}
        pan={box.pan}
        onBrokenHeartPress = {onBrokenHeartPress}
        onHeartPress = {onHeartPress}
        />
      ))}
      <View style={styles.TopView}>
      <View style={styles.TopViewBackButton}>
        <TouchableOpacity style={styles.matchBackbuttonOpacity} onPress={(() => {
            navigation.navigate('MatchMain')
        })}>
          <Image 
            style={styles.matchInfoEditIcon}
            source={back}
          />
        </TouchableOpacity>
        </View>
        <View style={styles.TopViewTextBox}>
        <Text style={styles.detailText}>추천 친구</Text>
        <Text style={styles.detailText}>{cur} / {length}</Text>
        </View>
        <View style={styles.TopViewEndButton}>
        <TouchableOpacity style={styles.matchInfoEditIconViewCenter} onPress={() => {
          navigation.navigate('MatchResult')
        }}>
          <Image 
            style={styles.matchInfoEditIcon}
            source={end}
          />
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT*0.82,
    width: SCREEN_WIDTH,
    backgroundColor: 'rgb(253, 245, 169)',
    alignItems: 'center',
    justifyContent: 'flex-start'

  },
  box: {
    marginTop: SCREEN_HEIGHT*0.1,
    height: SCREEN_HEIGHT*0.65,
    width: SCREEN_WIDTH*0.8,
    borderRadius: 5,
    position: 'absolute',
    backgroundColor: 'pink',
    alignItems: 'center',
    // justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 5,
  },
  image: {
    width: '100%',
    height: '50%',
    borderRadius: 5,
  },
  detail:{
    height: '50%',
    width: '100%',
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText:{
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  heartBox:{
    height: SCREEN_WIDTH * 0.20,
    flexDirection: 'row',
    alignContent:'space-between',
    marginTop: SCREEN_HEIGHT*0.02
  },
  heartButton:{
    fontSize: SCREEN_WIDTH*0.12,
    marginLeft: SCREEN_WIDTH*0.2,
  },
  brokenHeartButton:{
    fontSize: SCREEN_WIDTH*0.12,
  },
  TopView:{
    height: SCREEN_HEIGHT*0.1,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    zIndex: -1,
    flexDirection:'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8, 
  },
  TopViewTextBox: {
    flex:1,
    alignItems: 'center',
  },

  TopViewEndButton: {
    position: 'absolute',
    left: SCREEN_WIDTH * 0.85,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: 'black',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  TopViewBackButton: {
    position: 'absolute',
    right: SCREEN_WIDTH * 0.85,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: 'black',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  matchInfoEditIconViewCenter: {
    width: 40,
    height: 40,
  },
  matchBackbuttonOpacity:{
    width: 28,
    height: 28
  },
  matchInfoEditIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
