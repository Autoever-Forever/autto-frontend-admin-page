import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, IconButton, Grid, Card, CardContent } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers';
import {ProductRequest, SeatInventory} from "../../types/product"
import 'dayjs/locale/ko';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { registerProduct } from '../../api/registerApi';

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

  const [seatInventory, setSeatInventory] = useState<SeatInventory>({
    date: '',
    price: 0,
    currencyCode: 'KRW',
    reservedSeats: 0,
    totalSeats: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    if (!formData.title || !formData.location || !formData.runningTime || 
        !formData.ticketingOpenDate || !formData.ticketingCloseDate || 
        !formData.performStartDate || !formData.performEndDate) {  // 공연 시작/종료일 검증 추가
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    const formDataToSend = new FormData();
    const requestJson = new Blob([JSON.stringify({
      ...formData,
      performStartDate: formData.performStartDate,  // 명시적으로 포함
      performEndDate: formData.performEndDate       // 명시적으로 포함
    })], {
      type: 'application/json'
    });

    formDataToSend.append('request', requestJson, 'request.json');
    if (files.poster) formDataToSend.append('poster', files.poster);
    if (files.thumbnail) formDataToSend.append('thumbnail', files.thumbnail);

    try {
      const response = await registerProduct(formDataToSend);
      if (response.success) {
        alert('상품이 성공적으로 등록되었습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('상품 등록 중 오류가 발생했습니다.');
    }
  };

  const handleAddSeatInventory = () => {
    if (seatInventory.date && seatInventory.price > 0 && seatInventory.totalSeats > 0) {
      setFormData({
        ...formData,
        seatInventories: [...formData.seatInventories, {
          ...seatInventory,
          reservedSeats: 0
        }]
      });
      // Reset the form
      setSeatInventory({
        date: '',
        price: 0,
        currencyCode: 'KRW',
        reservedSeats: 0,
        totalSeats: 0
      });
    } else {
      alert('모든 필드를 입력해주세요.');
    }
  };

  const handleRemoveSeatInventory = (index: number) => {
    setFormData({
      ...formData,
      seatInventories: formData.seatInventories.filter((_, i) => i !== index)
    });
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

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <DateTimePicker
              label="공연 시작일시"
              value={formData.performStartDate ? dayjs(formData.performStartDate) : null}
              onChange={(newValue) => {
                if (newValue) {
                  setFormData({
                    ...formData,
                    performStartDate: newValue.toISOString()
                  });
                }
              }}
            />
            <DateTimePicker
              label="공연 종료일시"
              value={formData.performEndDate ? dayjs(formData.performEndDate) : null}
              onChange={(newValue) => {
                if (newValue) {
                  setFormData({
                    ...formData,
                    performEndDate: newValue.toISOString()
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

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              공연 회차 정보
            </Typography>
            
            <Card sx={{ mb: 2, p: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <DateTimePicker
                      label="공연 일시"
                      value={seatInventory.date ? dayjs(seatInventory.date) : null}
                      onChange={(newValue) => {
                        if (newValue) {
                          setSeatInventory({
                            ...seatInventory,
                            date: newValue.toISOString()
                          });
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="가격"
                      type="number"
                      value={seatInventory.price}
                      onChange={(e) => setSeatInventory({
                        ...seatInventory,
                        price: Number(e.target.value)
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="총 좌석 수"
                      type="number"
                      value={seatInventory.totalSeats}
                      onChange={(e) => setSeatInventory({
                        ...seatInventory,
                        totalSeats: Number(e.target.value)
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddSeatInventory}
                      sx={{ mt: 1 }}
                    >
                      회차 추가
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* 등록된 회차 목록 */}
            {formData.seatInventories.map((inventory, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <Typography>
                        공연일시: {dayjs(inventory.date).format('YYYY-MM-DD HH:mm')}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        가격: {inventory.price.toLocaleString()}원
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>
                        총 좌석: {inventory.totalSeats}석
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <IconButton 
                        color="error" 
                        onClick={() => handleRemoveSeatInventory(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
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