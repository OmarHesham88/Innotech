import React from 'react';
import { Box, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

import icon1 from '/public/accepted.png';
import icon2 from '/public/rejected.png';
import icon3 from '/public/paused.png';
import icon4 from '/public/waiting.png';

const topcards = [
    {
        icon: icon1,
        title: 'مقبول',
        digits: '100',
        bgcolor: 'success',
    },
    {
        icon: icon2,
        title: 'مرفوض',
        digits: '4',
        bgcolor: 'error',
    },
    {
        icon: icon3,
        title: 'معلق',
        digits: '10',
        bgcolor: 'primary',
    },
    {
        icon: icon4,
        title: 'قيد الإنتظار',
        digits: '33',
        bgcolor: 'warning',
    },

];

const OrdersCards = () => {
    return (
        <Grid container spacing={3} justifyContent={'center'}>
            {topcards.map((topcard, i) => (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
                    <Box bgcolor={topcard.bgcolor + '.light'} textAlign="center">
                        <CardContent>
                            <img src={topcard.icon} alt={topcard.icon} width="100" />
                            <Typography
                                color={topcard.bgcolor + '.main'}
                                mt={1}
                                variant="subtitle1"
                                fontWeight={600}
                            >
                                {topcard.title}
                            </Typography>
                            <Typography color={topcard.bgcolor + '.main'} variant="h4" fontWeight={600}>
                                {topcard.digits}
                            </Typography>
                        </CardContent>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
};

export default OrdersCards;
