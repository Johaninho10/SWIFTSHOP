import { Loader, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchReviewsQuery } from "../app/services/reviews";
import ReviewItem from "./ReviewItem";
import { useInView } from "react-intersection-observer";

type Review = {
  id: string;
  text: string;
  rate: string;
  createdAt: string;
  updatedAt: string;
};

type Data = {
  success: boolean;
  reviews: Review[];
  totalPages: number;
};

const ShowReviews = ({
  changeShowReviews,
  selectReview,
  changeUpdateReview,
}: {
  changeShowReviews: () => void;
  selectReview: (id: string) => void;
  changeUpdateReview: (value: boolean) => void;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { id: productId } = useParams();

  if (!productId) {
    return null;
  }

  const { data, isLoading }: { data: Data; isLoading: boolean } =
    useFetchReviewsQuery({ productId, page });

  const loaderRef = useRef<SVGSVGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const { ref: sentinelRef, inView } = useInView({
    root: rootRef.current,
    threshold: 0.5,
  });

  useEffect(() => {
    if (data?.success) {
      setReviews((prev) => {
        let reviewsCopy = [...prev];
        const reviewsIds = reviewsCopy.map((item) => item.id);
        const newReviews = data.reviews.filter(
          (item) => !reviewsIds.includes(item.id),
        );
        reviewsCopy.push(...newReviews);
        return reviewsCopy;
      });
    }
  }, [data]);

  useEffect(() => {
    if(inView){
        if (data?.success) {
          if (page < data.totalPages) {
            setPage((prev) => prev + 1);
          }else{
            setHasMore(false)
          }
        }
    }
  }, [inView]);

  return (
    <div id="box">
      <div
        className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm"
        onClick={() => changeShowReviews()}
      />
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="bg-white overflow-y-scroll dark:bg-gray-800 py-6 px-6 rounded-2xl w-11/12 max-w-md mx-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 shadow-xl h-100"
      >
        <div className="flex justify-end">
          <button
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => changeShowReviews()}
          >
            <X size={18} className="text-slate-500 dark:text-gray-400" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader className="text-slate-700 dark:text-gray-300 text-[10px] animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-y-5 mt-2">
            {reviews.map((review) => (
              <ReviewItem
                review={review}
                key={review.id}
                selectReview={selectReview}
                changeUpdateReview={changeUpdateReview}
                changeShowReviews={changeShowReviews}
              />
            ))}
            <div className="flex justify-center" ref={sentinelRef}>
              {hasMore && <Loader ref={loaderRef} className="animate-spin text-center text-[10px] text-slate-700 dark:text-gray-300" />}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ShowReviews;
