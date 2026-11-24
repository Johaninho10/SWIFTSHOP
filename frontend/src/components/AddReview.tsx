import Rating from "@mui/material/Rating";
import { useState } from "react";
import { useCreateReviewsMutation } from "../app/services/reviews";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Loader, X } from "lucide-react";
import { motion } from "motion/react";

const AddReview = ({
  changeAddReview,
}: {
  changeAddReview: (value: boolean) => void;
}) => {
  const [rate, setRate] = useState(2.5);
  const [text, setText] = useState("");
  const [createReview, { isLoading }] = useCreateReviewsMutation();
  const { id } = useParams();

  const handleCreateReview = async () => {
    try {
      if (!text.trim()) {
        throw new Error("The text of the review is required");
      }
      const result = await createReview({ text, rate, productId: id }).unwrap();

      if (result.success) {
        toast.success(result.message);
        changeAddReview(false);
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
        onClick={() => changeAddReview(false)}
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
            Write a Review
          </h1>
          <button
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => changeAddReview(false)}
          >
            <X size={18} className="text-slate-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-x-3 mb-4">
          <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">
            Rating
          </p>
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
          placeholder="Share your thoughts about this product..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Submit */}
        <button
          className="flex items-center justify-center gap-x-2 text-white bg-primary hover:opacity-90 active:scale-95 transition-all py-2.5 w-full mt-4 rounded-xl font-semibold text-sm disabled:opacity-60"
          onClick={handleCreateReview}
          disabled={isLoading}
        >
          {isLoading && <Loader size={16} className="animate-spin" />}
          <span>{isLoading ? "Submitting..." : "Submit Review"}</span>
        </button>
      </motion.div>
    </div>
  );
};

export default AddReview;
