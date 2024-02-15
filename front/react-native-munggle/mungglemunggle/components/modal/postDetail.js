import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet,
  ScrollView, TouchableOpacity, Button,
  Dimensions, ActivityIndicator,
  TextInput, 
} from "react-native";

import iconClose from "../../assets/icons/close1.png";
import iconBornWhite from "../../assets/icons/bornWhite.png";
import iconBornBlack from "../../assets/icons/bornBlack.png";
import iconScrap from "../../assets/icons/scrap.png";
import iconScrapBlack from "../../assets/icons/scrapBlack.png";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { combineTransition } from "react-native-reanimated";

import { AntDesign } from '@expo/vector-icons';

import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function PostDetail (props) {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";

  const [authToken, setAuthToken] = useState("");

  const [post, setPost] = useState(false);
  const [commentList, setCommentList] = useState(false);

  const [commentText, setCommentText] = useState("");
  
  const [isScraped, setIsScraped] = useState(post.isScraped);
  const [isLiked, setIsLiked] = useState(post.isLiked);

  const formatDate = (date) => {
    const day = new Date(date);

    const now = Date.now();

    const diff = (now - day.getTime()) / 1000;

    if (diff < 60 * 1) {
      return "방금 전";
    } else if (diff < 60 * 60 * 24 * 3) {
      return formatDistanceToNow(day, {addSuffix: true, locale: ko});
    } else {
      return format(day, "yyyy-MM-dd  HH:mm", {locale: ko});
    }
  }

  const getPostData = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    if (!post) {
      await axios.get(
        `${apiUrl}/posts/${props.postId}`,
        {headers: {
          "Authorization": authToken ,
        }}
      ).then((res) => {
        setPost(res.data);
      }).catch((err) => {
        console.log(err);
      })
    }
  };

  const getCommentData = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    await axios.get(
      `${apiUrl}/comments/${props.postId}?page=${0}`,
      {headers: {
        "Authorization": authToken ,
      }}
    ).then((res) => {
      setCommentList(res.data.comments);
    }).catch((err) => {
      console.log(err);
    })
  };

  const createComment = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    const payLoad = { contents: commentText };

    console.log(commentText);
    console.log(props.postId);

    await axios.post(
      `${apiUrl}/comments/${props.postId}`,
      payLoad,
      {headers: {
        "Authorization": authToken ,
        "Content-Type": "application/json",
      }}
    ).then((res) => {
      console.log(res.status);
      setCommentText("");
    }).then(async () => {
      await getCommentData();
    }).catch((err) => {
      console.log(err);
    })
  }

  const postScrap = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    console.log(props.postId);

    await axios.post(
      `${apiUrl}/posts/${props.postId}/scrap`,
      {headers: {
        "Authorization": authToken ,
      }}
    ).then((res) => {
      console.log(res.status);
      setIsScraped(!isScraped);
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    if (!authToken) {
      setAuthToken(AsyncStorage.getItem("accessToken"));
    };
  }, []);

  useEffect(() => {
    if (!post) {
      getPostData();
    };
    
    if (!commentList) {
      getCommentData();
    };
  }, [authToken]);

  const handleLike = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    await axios.post(
      `${apiUrl}/posts/${props.postId}/like`,
      {headers: {
        "Authorization": authToken ,
      }}
    ).then((res) => {
      console.log(res.status);
      setIsLiked(!isLiked);
    }) .catch((err) => {
      console.log(err);
    })
  };

  const postDetail = () => {
    if (post) {
      return (
        <View>
          <View style={styles.postDetailTopView}>
            { post.images.map((image, index) => {
                return (
                  <Image
                    key={index} 
                    style={styles.postDetailImage}
                    src={image}
                  />
                );
              })
            }
          </View>
  
          <View style={styles.postDetailMiddleView}>
            <View style={styles.postDetailMiddleLeftView}>
              <Text style={styles.postDetailTitle}>{post.postTitle}</Text>
              <Text style={styles.postDetailDate}>{formatDate(post.createdAt)}</Text>
            </View>
  
            <View style={styles.postDetailMiddleRightView}>
              <Text style={styles.postDetailLikeCount}>{post.likeCnt}</Text>
              <TouchableOpacity
                onPress={() => handleLike()}
              >
                <Image 
                  style={styles.postDetailLikeIcon}
                  source={isLiked ? iconBornBlack : iconBornWhite}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => postScrap()}
              >
                <Image 
                  style={styles.postDetailScrapIcon}
                  source={isScraped ? iconScrapBlack : iconScrap}
                />
              </TouchableOpacity>
            </View>
          </View>
  
          <View style={styles.postDetailContentView}>
            <View style={styles.postDetailContentInView}>
              <Text style={styles.postDetailContent}>{post.postContent}</Text>
            </View>
          </View>
  
          <ScrollView 
            style={styles.postDetailTagListView}
            horizontal={true}
          >
            {post.hashtags && post.hashtags.map((tag, index) => {
                return (
                  <View style={styles.postDetailTagView} key={index}>
                  <Text style={styles.postDetailTagText}># {tag}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.indicatorView}>
          <ActivityIndicator size={100} />
        </View>
      );
    }
  }

  const comments = () => {
    if (commentList && commentList.length != 0) {
      return (
        <View style={styles.postDetailCommentList}>
          {commentList.map((comment, index) => {
            return (
            <View key={index} style={styles.postDetailComment}>
              <View style={styles.postDetailCommentLeftView}>
                <Text style={styles.postDetailCommentUsername}>{comment.user.nickname}</Text>
                <Text style={styles.postDetailCommentCreateAt}>{formatDate(comment.createdAt)}</Text>
              </View>
              <View style={styles.postDetailCommentContentView}>
                <Text style={styles.postDetailCommentContent}>{comment.contents}</Text>
              </View>
              <View style={styles.postDetailCommentRightView}>
                <TouchableOpacity>
                  {!comment.haveLiked &&
                    <AntDesign name="like2" size={24} color="black" />
                  }
                  {comment.haveLiked &&
                    <AntDesign name="like1" size={24} color="black" />
                  }
                </TouchableOpacity>
                <Text>{comment.likeCnt ? comment.likeCnt : 0}</Text>
              </View>
            </View>
            );
          })}
        </View>
      );
    } else {
      return (
        <Text style={styles.postDetailCommentContent}>아직 댓글이 없습니다.</Text>
      );
    }
  }

  return (
    <View style={styles.detailModalBackGround}>
      <View style={styles.detailModalContainer}>
        <ScrollView style={styles.detailModalScrollView}>
          <TouchableOpacity
            style={styles.closeView}
            onPress={props.closeDetailModal}
            >
            <Image 
              style={styles.closeImage}
              source={iconClose}
            />
          </TouchableOpacity>

          {postDetail()}

          <View style={styles.postDetailCommentView}>
            <View style={styles.postDetailCommentTopView}>
              <Text style={styles.postDetailCommentTitle}>댓글</Text>
              <Text style={styles.postDetailCommentCount}>{commentList.length} 개</Text>
            </View>

            <View style={styles.postDetailCommentMiddleView}>
              {comments()}
            </View>

            <View style={styles.postDetailCommentBottomView}>
              <TextInput
                style={styles.postDetailCommentTextInput}
                placeholder="내용을 입력해주세요."
                placeholderTextColor="gray"
                keyboardAppearance="dark"
                keyboardType="web-search"
                onChangeText={(e) => setCommentText(e)}
                value={commentText}
              />
              <TouchableOpacity
                style={styles.postDetailCommentSubmitView}
                onPress={() => createComment()}
              >
                <Text style={styles.postDetailCommentSubmitText}>등록</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailModalBackGround: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  detailModalContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.83,
    backgroundColor: "white",
    marginBottom: SCREEN_HEIGHT * 0.035,
    paddingTop: SCREEN_HEIGHT * 0.02,
    borderRadius: 30,
    position: "relative",
  },
  detailModalScrollView: {
  },

  closeView: {
    width: SCREEN_WIDTH * 0.06,
    height: SCREEN_WIDTH * 0.06,
    position: "absolute",
    top: 0,
    right: 5,
  },
  closeImage: {
    width: SCREEN_WIDTH * 0.06,
    height: SCREEN_WIDTH * 0.06,
  },

  postDetailTopView: {
    marginTop: SCREEN_HEIGHT * 0.03,
    width: SCREEN_WIDTH * 0.9,
    // height: SCREEN_HEIGHT * 0.31,
    justifyContent: "center",
    alignItems: "center",
  },
  postDetailImage: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.31,
    marginVertical: SCREEN_HEIGHT * 0.01,
    borderRadius: 20,
  },
  
  postDetailMiddleView: {
    marginTop: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH * 0.9,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  postDetailMiddleLeftView: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_HEIGHT * 0.08,
    justifyContent: "space-around",
  },
  postDetailTitle: {
    fontSize: 23,
    fontWeight: "600",
  },
  postDetailDate: {
    fontSize: 17,
    color: "gray",
  },
  postDetailMiddleRightView: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.08,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-around',
  },
  postDetailLikeCount: {
    fontSize: 20,
    fontWeight: "500",
    color: "rgb(146, 146, 0)",
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  postDetailLikeIcon: {
    width: SCREEN_WIDTH * 0.07,
    height: SCREEN_WIDTH * 0.07,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  postDetailScrapIcon: {
    width: SCREEN_WIDTH * 0.07,
    height: SCREEN_WIDTH * 0.07,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  
  postDetailContentView: {
    marginTop: SCREEN_HEIGHT * 0.01,
    marginBottom: SCREEN_HEIGHT * 0.02,
    width: SCREEN_WIDTH * 0.9,
    alignItems: "center",
  },
  postDetailContentInView: {
    width: SCREEN_WIDTH * 0.8,
  },
  postDetailContent: {
    fontSize: 19,
  },

  postDetailTagListView: {
    flexDirection: "row",
    marginLeft: SCREEN_WIDTH * 0.05,
  },
  postDetailTagView: {
    backgroundColor: "rgb(180, 180, 180)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SCREEN_WIDTH * 0.005,
    paddingHorizontal: SCREEN_WIDTH * 0.03,
    paddingVertical: SCREEN_HEIGHT * 0.003,
  },
  postDetailTagText: {
    color: "white",
    fontSize: 17,
  },

  postDetailCommentView: {
    width: SCREEN_WIDTH * 0.9,
    alignItems: "center",
    marginTop: SCREEN_HEIGHT * 0.01,
  },
  postDetailCommentTopView: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postDetailCommentTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  postDetailCommentCount: {
    fontSize: 20,
    fontWeight: "600",
  },
  postDetailCommentMiddleView: {
    width: SCREEN_WIDTH * 0.8,
  },
  postDetailCommentList: {
    width: SCREEN_WIDTH * 0.8,
    alignItems: "center",
  },
  postDetailComment: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.05,
    flexDirection: "row",
    marginVertical: SCREEN_HEIGHT * 0.005,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    paddingBottom: SCREEN_HEIGHT * 0.06,
  },
  postDetailCommentLeftView: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_HEIGHT * 0.05,
    alignItems: "flex-start",
  },
  postDetailCommentUsername: {
    fontSize: 17,
    fontWeight: "600",
  },
  postDetailCommentCreateAt: {
    fontSize: 13,
  },
  postDetailCommentContentView: {
    width: SCREEN_WIDTH * 0.43,
    height: SCREEN_HEIGHT * 0.05,
    justifyContent: "center",
  },
  postDetailCommentContent: {
    fontSize: 16,
    flexWrap: "wrap",
  },
  postDetailCommentRightView: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_HEIGHT * 0.05,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  postDetailCommentBottomView: {
    width: SCREEN_WIDTH * 0.9,
    alignItems: "center",
    marginVertical: SCREEN_HEIGHT * 0.02,
    position: "relative",
  },
  postDetailCommentTextInput: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.06,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 15,
    paddingLeft: SCREEN_WIDTH * 0.02,
    fontSize: 17,
  },
  postDetailCommentSubmitView: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_HEIGHT * 0.05,
    backgroundColor: "rgb(253, 245, 169)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderWidth: 1,
    borderRadius: 15,
    right: SCREEN_WIDTH * 0.07,
    top: SCREEN_HEIGHT * 0.005,
  },
  postDetailCommentSubmitText: {
    fontSize: 18,
    fontWeight: "500",
  },

  indicatorView: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.3,
    justifyContent: "center",
    alignItems: "center",
  }
});