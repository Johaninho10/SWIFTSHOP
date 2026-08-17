import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

export default function BasicRating({rate, readOnly}: {rate: number, readOnly: boolean}) {
  return (
    <Stack spacing={1}>
      <Rating name="half-rating" defaultValue={rate} precision={0.5} readOnly={readOnly} size='small'/>
    </Stack>
  );
}
