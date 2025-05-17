import React, { useState, useEffect } from "react";
import { getNotes } from "../../service/post";
import type { NotesInterface } from "../../interface/INote";
import { Modal as AntModal, Row, Col, Card, Divider } from "antd";
import "./model.css";

interface ReviewModalProps {
  isVisible: boolean;
  handleCancel: () => void;
}

const Modal: React.FC<ReviewModalProps> = ({ isVisible, handleCancel }) => {
  const [reviews, setReviews] = useState<NotesInterface[]>([]);
  const [expandedReviewIds, setExpandedReviewIds] = useState<string[]>([]); // เปลี่ยนจาก number[] เป็น string[]

  useEffect(() => {
    const fetchData = async () => {
      const notes = await getNotes();
      if (Array.isArray(notes)) {
        setReviews(notes);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setExpandedReviewIds([]);
  }, [isVisible]);

  const toggleShowMore = (noteId: string) => {
    setExpandedReviewIds((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId]
    );
  };

  const renderComment = (review: NotesInterface) => {
    const comment = review.description || "";
    const id = review.note_id;
    if (!id) return <span>{comment}</span>;

    const isExpanded = expandedReviewIds.includes(id);

    if (comment.length > 300 && !isExpanded) {
      return (
        <>
          <span dangerouslySetInnerHTML={{ __html: comment.substring(0, 300) }} />
          <span
            onClick={() => toggleShowMore(id)}
            style={{
              color: "#007BFF",
              cursor: "pointer",
              fontWeight: "bold",
              marginLeft: "5px",
            }}
          >
            ...Show more
          </span>
        </>
      );
    }

    return (
      <>
        <span dangerouslySetInnerHTML={{ __html: comment }} />
        {comment.length > 300 && (
          <span
            onClick={() => toggleShowMore(id)}
            style={{
              color: "#007BFF",
              cursor: "pointer",
              fontWeight: "bold",
              marginLeft: "5px",
            }}
          >
            Show less
          </span>
        )}
      </>
    );
  };

  return (
    <AntModal
      open={isVisible}
      onCancel={handleCancel}
      footer={null}
      className="modal-comment"
      centered
      title="All Post"
    > <br /><br />
      <Row gutter={16} align="top">
        <Col span={24}>
          <Card>
            <div className="review-list-container">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.note_id}>
                    <div className="review-container">
                      <div className="reviews-comment-text">
                        Post By : <span style={{ fontWeight: "bold" }}>{review.username}</span>
                        <p>Title : {review.title}</p>
                        <p className="comment-reviews-render">{renderComment(review)}</p>
                      </div>
                    </div>
                    <br />
                    <Divider />
                  </div>
                ))
              ) : (
                <center>
                  <div
                    style={{
                      color: "rgb(99, 94, 94)",
                      fontSize: "28px",
                      fontFamily: "revert-layer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <p>No Reviews for Zoo</p>
                  </div>
                </center>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </AntModal>
  );
};

export default Modal;
