import { Loader, Pencil, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useDeleteReviewMutation } from "../app/services/reviews";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import BasicRating from "./BasicRating";
import { useState } from "react";

type User = {
  user: {
    id: string;
  };
};

type Store = {
  user: User;
};

const ReviewItem = ({
  review,
  changeUpdateReview,
  selectReview,
  changeShowReviews,
}: {
  review: any;
  changeUpdateReview: (value: boolean) => void;
  selectReview: (id: string) => void;
  changeShowReviews: (value: boolean) => void;
}) => {
  const [showMore, setShowMore] = useState(false);
  const user = useSelector((store: Store) => store.user.user);
  const [deleteReview, { isLoading: deleteLoading }] =
    useDeleteReviewMutation();

  const handleDeleteReview = async (id: string) => {
    try {
      const result = await deleteReview(id).unwrap();

      if (result.success) {
        toast.success(result.message);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white dark:bg-gray-700 rounded-2xl px-5 py-5 shadow-sm border border-slate-100 dark:border-gray-700"
      key={review.id}
    >
      <div className="flex justify-between items-start gap-x-3">
        {/* Avatar + meta */}
        <div className="flex items-center gap-x-4 flex-1 min-w-0">
          <div className="w-11 h-11 shrink-0 rounded-full bg-primary text-white flex justify-center items-center text-sm font-semibold tracking-wide">
            {review.user.firstname.toUpperCase()[0]}
            {review.user.lastname.toUpperCase()[0]}
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-gray-200 truncate">
              {review.user.firstname} {review.user.lastname}
            </h2>
            <p className="text-xs text-slate-400 dark:text-gray-400 mt-0.5">
              {new Date(review.updatedAt).toLocaleDateString("en-EN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
            <div className="mt-1">
              <BasicRating rate={review.rate} readOnly={true} />
            </div>
          </div>
        </div>

        {/* Action buttons (only for review owner) */}
        {user.id == review.userId && (
          <div className="flex items-center gap-x-2 shrink-0">
            <button
              className="p-2.5 rounded-lg bg-primary transition-colors"
              onClick={() => {
                changeShowReviews(false);
                selectReview(review.id);
                changeUpdateReview(true);
              }}
            >
              <Pencil className="text-white text-xl" />
            </button>
            <button
              className="p-2.5 rounded-lg bg-red-500 transition-colors"
              onClick={() => handleDeleteReview(review.id)}
            >
              {deleteLoading ? (
                <Loader className="animate-spin text-white text-xl" />
              ) : (
                <Trash2 className="text-white text-xl" />
              )}
            </button>
          </div>
        )}
      </div>

      <p className="text-slate-500 dark:text-gray-400 mt-4 text-sm max-w-[80%] wrap-break-word">
        {review.text.length <= 60 || showMore ? review.text : review.text.slice(0, 60)}
        {review.text.length > 60 && (
          <span className="text-primary font-medium cursor-pointer" onClick={() => setShowMore(true)}>...See more</span>
        )}
      </p>
    </motion.div>
  );
};

export default ReviewItem;
