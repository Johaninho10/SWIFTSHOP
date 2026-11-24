import Rating from "@mui/material/Rating";
import { useEffect, useState } from "react";
import {
  useGetReviewQuery,
  useUpdateReviewMutation,
} from "../app/services/reviews";
import { toast } from "react-hot-toast";
import { Loader, X } from "lucide-react";
import { motion } from "motion/react";

const UpdateReview = ({
  changeUpdateReview,
  reviewId,
}: {
  changeUpdateReview: (value: boolean) => void;
  reviewId: string;
}) => {
  const [rate, setRate] = useState(2.5);
  const [text, setText] = useState("");
  const { data, isLoading } = useGetReviewQuery(reviewId);
  const [updateReview, { isLoading: updateLoading }] =
    useUpdateReviewMutation();

  useEffect(() => {
    if (data?.success) {
      setText(data.review.text);
      setRate(data.review.rate);
    }
  }, [data]);

  const handleUpdateReview = async () => {
    try {
      const result = await updateReview({ text, rate, id: data.review.id }).unwrap();

      if (result.success) {
        toast.success(result.message);
        changeUpdateReview(false);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm"
        onClick={() => changeUpdateReview(false)}
      />

      {/* Modal */}
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 py-6 px-6 rounded-2xl w-11/12 max-w-md mx-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg font-semibold text-slate-700 dark:text-gray-200">
            Update Review
          </h1>
          <button
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => changeUpdateReview(false)}
          >
            <X size={18} className="text-slate-500 dark:text-gray-400" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader className="animate-spin text-primary" size={28} />
          </div>
        ) : (
          <>
            {/* Rating */}
            <div className="flex items-center gap-x-3 mb-4">
              <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Rating</p>
              <Rating
                name="half-rating"
                defaultValue={rate}
                value={rate}
                precision={0.5}
                size="medium"
                onChange={(_, value) => {
                  if (value) setRate(value);
                }}
              />
              <span className="text-sm text-primary font-semibold">{rate}</span>
            </div>

            {/* Text */}
            <label className="block text-sm text-slate-500 dark:text-gray-400 font-medium mb-1">
              Your Review
            </label>
            <textarea
              className="border border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-700 w-full resize-none rounded-xl h-36 p-4 text-sm text-slate-700 dark:text-gray-200 focus:ring-2 focus:ring-primary/40 transition-all duration-200"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {/* Submit */}
            <button
              className="flex items-center justify-center gap-x-2 text-white bg-primary hover:opacity-90 active:scale-95 transition-all py-2.5 w-full mt-4 rounded-xl font-semibold text-sm disabled:opacity-60"
              onClick={handleUpdateReview}
              disabled={updateLoading}
            >
              {updateLoading && <Loader size={16} className="animate-spin" />}
              <span>{updateLoading ? "Saving..." : "Save Changes"}</span>
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default UpdateReview;
