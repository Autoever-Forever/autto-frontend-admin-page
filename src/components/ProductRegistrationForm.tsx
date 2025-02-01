import React, { useState } from 'react';
// @ts-ignore
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { ProductRequest } from "../types/product";
import 'dayjs/locale/ko';

const ProductRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<ProductRequest>({
    title: '',
    location: '',
    runningTime: '',
    ticketingLimit: 1,
    ticketingOpenDate: '',
    ticketingCloseDate: '',
    performStartDate: '',
    performEndDate: '',
    seatInventories: []
  });

  const [files, setFiles] = useState({
    poster: null as File | null,
    thumbnail: null as File | null
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    const requestJson = new Blob([JSON.stringify(formData)], {
      type: 'application/json'
    });

    formDataToSend.append('request', requestJson, 'request.json');
    if (files.poster) formDataToSend.append('poster', files.poster);
    if (files.thumbnail) formDataToSend.append('thumbnail', files.thumbnail);

    try {
      const response = await fetch('http://{}/admin/product', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        alert('상품이 성공적으로 등록되었습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('상품 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <Paper sx={{ p: 3, m: 2 }}>
        <Typography variant="h5" gutterBottom>
          공연 상품 등록
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="공연 제목"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            margin="normal"
          />

          <TextField
            fullWidth
            label="공연 장소"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            margin="normal"
          />

          <TextField
            fullWidth
            label="러닝타임 (분)"
            value={formData.runningTime}
            onChange={(e) => setFormData({...formData, runningTime: e.target.value})}
            margin="normal"
          />

          <TextField
            fullWidth
            type="number"
            label="예매 제한 수량"
            value={formData.ticketingLimit}
            onChange={(e) => setFormData({...formData, ticketingLimit: parseInt(e.target.value)})}
            margin="normal"
          />

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <DatePicker
              label="예매 시작일"
              onChange={(date) => {
                if (date) {
                  setFormData({
                    ...formData,
                    ticketingOpenDate: date.toISOString()
                  });
                }
              }}
            />
            <TimePicker
              label="예매 시작시간"
              onChange={(time) => {
                if (time) {
                  setFormData({
                    ...formData,
                    ticketingOpenDate: time.toISOString()
                  });
                }
              }}
            />
          </Box>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <DatePicker
              label="예매 종료일"
              onChange={(date) => {
                if (date) {
                  setFormData({
                    ...formData,
                    ticketingCloseDate: date.toISOString()
                  });
                }
              }}
            />
            <TimePicker
              label="예매 종료시간"
              onChange={(time) => {
                if (time) {
                  setFormData({
                    ...formData,
                    ticketingCloseDate: time.toISOString()
                  });
                }
              }}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">포스터 이미지</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFiles({
                ...files,
                poster: e.target.files?.[0] || null
              })}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">썸네일 이미지</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFiles({
                ...files,
                thumbnail: e.target.files?.[0] || null
              })}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            상품 등록
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default ProductRegistrationForm;