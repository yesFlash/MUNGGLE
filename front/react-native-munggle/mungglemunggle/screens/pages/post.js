import React, { useEffect, useState } from "react";
import { View, Text, Button,
  Image, Modal, Pressable,
  ScrollView, TouchableOpacity,
  StyleSheet, Dimensions,
  ActivityIndicator,
} from "react-native";
// import { Modal } from "react-native-modal";

import imgProfile1 from "../../assets/sample/profile1.jpg";
import imgProfile2 from "../../assets/sample/profile2.jpg";
import imgProfile3 from "../../assets/sample/profile3.jpg";
import imgProfile4 from "../../assets/sample/profile4.jpg";
import imgProfile5 from "../../assets/sample/profile5.jpg";
import imgProfile6 from "../../assets/sample/profile6.jpg";

import imgPost1 from "../../assets/sample/dog1.jpg";
import imgPost2 from "../../assets/sample/dog2.jpg";
import imgPost3 from "../../assets/sample/dog3.jpg";
import imgPost4 from "../../assets/sample/dog4.jpg";
import imgPost5 from "../../assets/sample/dog5.jpg";
import imgPost6 from "../../assets/sample/dog6.jpg";
import imgPost7 from "../../assets/sample/dog7.jpg";
import imgPost8 from "../../assets/sample/dog8.jpg";
import imgPost9 from "../../assets/sample/dog9.jpg";
import imgPost10 from "../../assets/sample/dog10.jpg";

import ProfileCircle from "../../components/profileCircle";
import FollowButton from "../../components/followButton";
import DirectMessageButton from "../../components/directMessageButton";

import iconScrap from "../../assets/icons/scrap.png";
import iconBornBlack from "../../assets/icons/bornBlack.png";
import iconBornWhite from "../../assets/icons/bornWhite.png";
import iconCreate from "../../assets/icons/create.png";

import PostDetail from "../../components/modal/postDetail";
import PostCreate from "../../components/modal/postCreate";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { format, formatDistanceToNow } from "date-fns";
// import {ko} from "data-fns/locale";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function PostScreen () {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";

  const [authToken, setAuthToken] = useState("");

  const [chooseTab, setChooseTab] = useState(0);

  const formatDate = (date) => {
    const day = new Date(date);

    const now = Date.now();

    const diff = (now - day.getTime()) / 1000;

    if (diff < 60 * 1) {
      return "방금 전";
    } else if (diff < 60 * 60 * 24 * 3) {
      return formatDistanceToNow(day, {addSuffix: true});
      // return formatDistanceToNow(day, {addSuffix: true, locale: ko});
    } else {
      return format(day, "ppp EEE p");
      // return format(day, "ppp EEE p", {locale: ko});
    }
  }

  const [postList, setPostList] = useState(false);
  const [followingPostList, setFollowingPostList] = useState(false);
  const [recommendUserList, setRecommendUserList] = useState(false);
  
  const getPost = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    console.log(postList);

    await axios.get(
      `${apiUrl}/posts/curating`,
      {headers: {
        "Authorization": authToken ,
      }}
    ).then((res) => {
      // console.log(res.data);
      setPostList(res.data);
    }) .catch((err) => {
      console.log(err);
    })
  };
  
  const getFollowingPost = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    // console.log(!followingPostList);

    if (!followingPostList) {
      await axios.get(
        `${apiUrl}/posts/following?page=${0}`,
        {headers: {
          "Authorization": authToken ,
        }}
      ).then((res) => {
        // console.log(res.data);
        setFollowingPostList(res.data);
        // console.log(followingPostList);
      }) .catch((err) => {
        console.log(err);
      })
    }
  };
  
  const getRecommendUser = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };
  
    // console.log(!followingPostList);
  
    if (!recommendUserList) {
      await axios.get(
        `${apiUrl}/users/recommend`,
        {headers: {
          "Authorization": authToken ,
        }}
      ).then((res) => {
        console.log(res.data);
        setRecommendUserList(res.data);
      }) .catch((err) => {
        console.log(err);
      })
    }
  };

  useEffect(() => {
    getPost();
    // console.log(postList);
    getFollowingPost();
    // console.log(followingPostList);
    getRecommendUser();
    console.log(recommendUserList);
  }, [])

  const profiles = () => {
    if (recommendUserList) {
      return (
        <ScrollView 
          horizontal={true}
          style={styles.profileCircleScrollView}
          contentContainerStyle={{
            alignItems: "center",
          }}
        >
          {recommendUserList && recommendUserList.map((userProfile, index) => {
            return (
              <View key={index} style={styles.profileCircleContainer}>
                <TouchableOpacity style={styles.profileCircleImageView}>
                  <Image 
                    style={styles.profileCircleImage}
                    src={userProfile.profileImgUrl}
                  />
                </TouchableOpacity>
  
                <View style={styles.profileCircleNameView}>
                  <Text style={styles.profileCircleName}>{ userProfile.nickname }</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      );
    } else {
      return (
        <View style={styles.postIndicatorView}>
          <ActivityIndicator size={100} />
        </View>
      );
    }
  }

  const [detailPost, setDetailPost] = useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
          
  const changeDetailPost = (postId) => {
    setDetailPost(postId);
  }

  const openDetailModal = (postId) => { 
    changeDetailPost(postId); 
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => { setIsDetailModalOpen(false) };

  const posts = (list) => {
    if (list) {
      return (
        <View style={styles.postBottomView}>
          {list && list.map((post, index) => {
  
            return(
              <View key={index} style={styles.postListView}>
                <View style={styles.postListViewLeftView}>
                  <ProfileCircle 
                    imageProfile={post.profileImage}
                    nameProfile={post.nickname}
                  />
                  <View style={styles.postListProfileButtonView}>
                    <FollowButton />
                    <DirectMessageButton />
                  </View>
                </View>
                
                <View style={styles.postListViewRightView}>
                  <TouchableOpacity 
                    style={styles.postListImageView}
                    onPress={() => openDetailModal(post.postId)}
                  >
                    <Image 
                      style={styles.postListImage}
                      src={post.imageURLs[0]} 
                    />
                  </TouchableOpacity>
  
                  <View style={styles.postListBottomView}>
                    <View style={styles.postListTextView}>
                      <Text style={styles.postListTitle}>{post.postTitle}</Text>
                      <Text style={styles.postListDate}>{formatDate(post.createdAt)}</Text>
                      <View style={styles.postListTagView}>
                        {post.hashtags && post.hashtags.map((tag, index) => {
                          return (
                            <View style={styles.postTagView} key={index}>
                              <Text style={styles.postTagText}># {tag}</Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                    <View style={styles.postListIconView}>
                      <View style={styles.postLikeCountView}>
                        <Text style={styles.postLikeCountText}>{post.likeCnt}</Text>
                      </View>
                      <TouchableOpacity style={styles.postLikeIcon}>
                        <Image 
                          style={styles.postLikeIcon}
                          source={iconBornWhite}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
          <Modal
            animationType="fade"
            transparent={true}
            visible={isDetailModalOpen}
            onRequestClose={() => closeDetailModal()}>
            <PostDetail closeDetailModal={closeDetailModal} postId={detailPost} />
          </Modal>
        </View>
      );
    } else {
      return (
        <View style={styles.postIndicatorView}>
          <ActivityIndicator size={100} />
        </View>
      );
    }
  }

  const postContent = () => {
    if (chooseTab === 0) {
      if (postList) {
        return posts(postList);
      } else {
        return (
          <View style={styles.postIndicatorView}>
            <ActivityIndicator size={100} />
          </View>
        );
      }
    } else {
      if (followingPostList) {
        return posts(followingPostList.posts);
      } else {
        return (
          <View style={styles.postIndicatorView}>
            <ActivityIndicator size={100} />
          </View>
        );
      }
    }
  };

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const openCreateModal = () => { setIsCreateModalOpen(true) }; 
  const closeCreateModal = () => { setIsCreateModalOpen(false) }; 

  return (
    <View style={styles.postContainer}>
      <ScrollView style={styles.postScrollView}>
        <View 
          style={{...styles.postTopView,
            height: chooseTab == 0 ? SCREEN_HEIGHT * 0.2 : SCREEN_HEIGHT * 0.05,
          }}
        >
          <View style={styles.postTopViewToggleButtonView}>
            <TouchableOpacity 
              style={{...styles.postToggleButtonLeft,
                backgroundColor: chooseTab == 0 ? "rgb(255, 214, 139)" : "rgb(253, 245, 169)",
              }}
              onPress={() => setChooseTab(0)}
            >
              <Text style={styles.postToggleButtonLeftText}>추천</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{...styles.postToggleButtonRight,
                backgroundColor: chooseTab == 0 ? "rgb(253, 245, 169)" : "rgb(255, 214, 139)",
              }}
              onPress={() => setChooseTab(1)}
            >
              <Text style={styles.postToggleButtonRightText}>팔로잉</Text>
            </TouchableOpacity>
          </View>

          {chooseTab == 0 && profiles()}        
        </View>

        {postContent()}

      </ScrollView>
      <TouchableOpacity 
        onPress={() => openCreateModal()}
        style={styles.postCreateView}
      >
        <Image 
          style={styles.postCreateImage}
          source={iconCreate}
        />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isCreateModalOpen}
        onRequestClose={() => closeCreateModal()}>
        <PostCreate openDetailModal={openDetailModal} closeCreateModal={closeCreateModal} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    width: SCREEN_WIDTH,
    backgroundColor: "rgb(249, 250, 208)",
    position: "relative",
  },
  postScrollView: {
    width: SCREEN_WIDTH,
  },
  postTopView: {
    width: SCREEN_WIDTH,
  },
  
  // profile Toggle Button
  postTopViewToggleButtonView: {
    marginTop: SCREEN_HEIGHT * 0.005,
    height: SCREEN_HEIGHT * 0.05,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  postToggleButtonLeft: {
    width: SCREEN_WIDTH * 0.17,
    height: SCREEN_HEIGHT * 0.04,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gainsboro",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  postToggleButtonLeftText: {
    fontSize: 17,
    fontWeight: "600",
  },
  postToggleButtonRight: {
    width: SCREEN_WIDTH * 0.17,
    height: SCREEN_HEIGHT * 0.04,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gainsboro",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  postToggleButtonRightText: {
    fontSize: 17,
    fontWeight: "600",
  },

  // Profile Circle Box
  profileCircleScrollView: {
    height: SCREEN_HEIGHT * 0.15,
  },

  profileCircleContainer: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.13,
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: SCREEN_WIDTH * 0.023,
  },
  profileCircleImageView: {
    borderRadius: 100,
    width: SCREEN_WIDTH * 0.18,
    height: SCREEN_WIDTH * 0.18,
  },
  profileCircleImage: {
    borderRadius: 100,
    // borderColor: "rgb(253, 255, 117)",
    borderColor: "lightgrey",
    borderWidth: 1,
    width: SCREEN_WIDTH * 0.18,
    height: SCREEN_WIDTH * 0.18,
  },
  profileCircleNameView: {
    width: SCREEN_WIDTH * 0.19,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCircleName: {
    fontSize: 13,
    fontWeight: "500",
  },

  // post List View
  postBottomView: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    paddingTop: 10,
  },
  postListView: {
    marginVertical: 10,
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.42,
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 15,
    alignItems: "flex-start",
    justifyContent: "space-around",
  },
  postListViewLeftView: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_HEIGHT * 0.2,
    backgroundColor: "white",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "space-around",
  },
  postListProfileButtonView: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 0.235,
    justifyContent: "space-between",
  },
  postListViewRightView: {
    width: SCREEN_WIDTH * 0.64,
    height: SCREEN_HEIGHT * 0.38,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 9,
    justifyContent: "space-around",
  },
  postListImageView: {
    width: SCREEN_WIDTH * 0.60,
    height: SCREEN_HEIGHT * 0.25,
    
  },
  postListImage: {
    width: SCREEN_WIDTH * 0.60,
    height: SCREEN_HEIGHT * 0.25,
    
  },
  postListBottomView: {
    width: SCREEN_WIDTH * 0.60,
    height: SCREEN_HEIGHT * 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  postListTextView: {
    width: SCREEN_WIDTH * 0.48,
    height: SCREEN_HEIGHT * 0.09,
    justifyContent: "space-between",
  },
  postListTitle: {
    fontSize: 19,
    fontWeight: "600",
  },
  postListDate: {
    fontSize: 13,
    color: "grey",
  },
  postListTagView: {
    flexDirection: "row",
  },
  postTagView: {
    backgroundColor: "rgb(180, 180, 180)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SCREEN_WIDTH * 0.025,
    paddingVertical: SCREEN_HEIGHT * 0.0015,
  },
  postTagText: {
    color: "white",
    fontSize: 14,
  },
  
  postListIconView: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_HEIGHT * 0.17,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postLikeIcon: {
    width: SCREEN_WIDTH * 0.055,
    height: SCREEN_WIDTH * 0.055,
    
  },
  postLikeCountView: {
    width: SCREEN_WIDTH * 0.055,
    height: SCREEN_WIDTH * 0.055,
    justifyContent: "flex-end",
  },
  postLikeCountText: {
    fontSize: 16,
    color: "rgb(146, 146, 0)",
  },
  postCreateView: {
    width: SCREEN_WIDTH * 0.19,
    height: SCREEN_WIDTH * 0.19,
    position: "absolute",
    bottom: SCREEN_WIDTH * 0.05,
    right: SCREEN_WIDTH * 0.05,
  },
  postCreateImage: {
    width: SCREEN_WIDTH * 0.19,
    height: SCREEN_WIDTH * 0.19,
  },

  postIndicatorView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
})