package com.munggle.comment.controller;

import com.munggle.comment.dto.CommentCreateDto;
import com.munggle.comment.dto.CommentDetailDto;
import com.munggle.comment.dto.CommentUpdateDto;
import com.munggle.comment.service.CommentService;
import com.munggle.domain.model.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // 댓글 작성
    @PostMapping("/{postId}")
    public void createComment(@AuthenticationPrincipal User principal,
                              @PathVariable Long postId, @RequestBody CommentCreateDto commentCreateDto){

        commentCreateDto.setUserId(principal.getId());
        commentCreateDto.setPostId(postId);
        commentService.insertComment(commentCreateDto);
    }

    // 댓글 수정
    @PutMapping("/{commentId}")
    public void updateComment(@AuthenticationPrincipal User principal,
                              @PathVariable Long commentId, @RequestBody CommentUpdateDto commentUpdateDto){

        commentUpdateDto.setCommentId(commentId);
        commentService.updateComment(principal.getId(), commentUpdateDto);
    }

    // 게시글 댓글 목록
    @GetMapping("/{postId}")
    public List<CommentDetailDto> readCommentList(@PathVariable Long postId){

        return commentService.getCommentList(postId);
    }

    // 댓글 상세
    @GetMapping("/{postId}/{commentId}")
    public CommentDetailDto createComment(@PathVariable Long postId, @PathVariable Long commentId){

        return commentService.getComment(commentId);
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public void createComment(@AuthenticationPrincipal User principal,
                              @PathVariable Long commentId){

        commentService.deleteComment(principal.getId(), commentId);
    }

    // 댓글 좋아요
}