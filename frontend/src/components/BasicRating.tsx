import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Star from "@mui/icons-material/Star"
export default function BasicRating({rate, readOnly}: {rate: number, readOnly: boolean}) {
  return (
    <Stack spacing={1}>
      <Rating name="half-rating" value={rate} precision={0.5} readOnly={readOnly} size='small'/>
    </Stack>
  );
}
