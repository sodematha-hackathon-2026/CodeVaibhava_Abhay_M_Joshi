import apiClient from '@/utils/axios';
import { 
  ArtefactAdmin, ArtefactUpsert,
  Event, CreateUpdateEvent,
  FlashAdmin, FlashUpsert,
  HistoryAdminItem, HistoryUpsert,
  NewsAdmin, NewsUpsert,
  QuestionAdmin, QuestionUpsert,
  SevaAdmin, SevaUpsert,
  SocialLinkAdminItem, SocialLinkUpsert,
  MathaInfoAdminItem, MathaInfoUpdateRequest,
  RoomBookingSummary, RoomBookingDetail, UpdateStatusRequest, ActionResponse,
  SevaOrderSummary, SevaOrderDetail,
  AlbumSummary, CreateAlbum, MediaItem, CreateMedia,
  AdminConfig, ConfigUpdateRequest,
  AdminActionResponse,
} from '@/types';

export const artefactsService = {
  list: async (): Promise<ArtefactAdmin[]> => {
    const response = await apiClient.get<ArtefactAdmin[]>('/admin/artefacts');
    return response.data;
  },

  create: async (data: ArtefactUpsert): Promise<ArtefactAdmin> => {
    const response = await apiClient.post<ArtefactAdmin>('/admin/artefacts', data);
    return response.data;
  },

  update: async (id: string, data: ArtefactUpsert): Promise<ArtefactAdmin> => {
    const response = await apiClient.put<ArtefactAdmin>(`/admin/artefacts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/artefacts/${id}`);
  },
};

export const eventsService = {
  list: async (): Promise<Event[]> => {
    const response = await apiClient.get<Event[]>('/admin/events');
    return response.data;
  },

  create: async (data: CreateUpdateEvent): Promise<Event> => {
    const response = await apiClient.post<Event>('/admin/events', data);
    return response.data;
  },

  update: async (id: string, data: CreateUpdateEvent): Promise<Event> => {
    const response = await apiClient.put<Event>(`/admin/events/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/events/${id}`);
  },
};

export const flashService = {
  list: async (): Promise<FlashAdmin[]> => {
    const response = await apiClient.get<FlashAdmin[]>('/admin/flash');
    return response.data;
  },

  create: async (data: FlashUpsert): Promise<FlashAdmin> => {
    const response = await apiClient.post<FlashAdmin>('/admin/flash', data);
    return response.data;
  },

  update: async (id: string, data: FlashUpsert): Promise<FlashAdmin> => {
    const response = await apiClient.put<FlashAdmin>(`/admin/flash/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/flash/${id}`);
  },
};

export const historyService = {
  list: async (): Promise<HistoryAdminItem[]> => {
    const response = await apiClient.get<HistoryAdminItem[]>('/admin/history');
    return response.data;
  },

  create: async (data: HistoryUpsert): Promise<HistoryAdminItem> => {
    const response = await apiClient.post<HistoryAdminItem>('/admin/history', data);
    return response.data;
  },

  update: async (id: string, data: HistoryUpsert): Promise<HistoryAdminItem> => {
    const response = await apiClient.put<HistoryAdminItem>(`/admin/history/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/history/${id}`);
  },
};

export const newsService = {
  list: async (): Promise<NewsAdmin[]> => {
    const response = await apiClient.get<NewsAdmin[]>('/admin/news');
    return response.data;
  },

  create: async (data: NewsUpsert): Promise<NewsAdmin> => {
    const response = await apiClient.post<NewsAdmin>('/admin/news', data);
    return response.data;
  },

  update: async (id: string, data: NewsUpsert): Promise<NewsAdmin> => {
    const response = await apiClient.put<NewsAdmin>(`/admin/news/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/news/${id}`);
  },
};

export const quizService = {
  listQuestions: async (): Promise<QuestionAdmin[]> => {
    const response = await apiClient.get<QuestionAdmin[]>('/admin/quiz/questions');
    return response.data;
  },

  createQuestion: async (data: QuestionUpsert): Promise<QuestionAdmin> => {
    const response = await apiClient.post<QuestionAdmin>('/admin/quiz/questions', data);
    return response.data;
  },

  updateQuestion: async (id: string, data: QuestionUpsert): Promise<QuestionAdmin> => {
    const response = await apiClient.put<QuestionAdmin>(`/admin/quiz/questions/${id}`, data);
    return response.data;
  },

  deleteQuestion: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/quiz/questions/${id}`);
  },
};

export const sevasService = {
  list: async (): Promise<SevaAdmin[]> => {
    const response = await apiClient.get<SevaAdmin[]>('/admin/sevas');
    return response.data;
  },

  create: async (data: SevaUpsert): Promise<SevaAdmin> => {
    const response = await apiClient.post<SevaAdmin>('/admin/sevas', data);
    return response.data;
  },

  update: async (id: string, data: SevaUpsert): Promise<SevaAdmin> => {
    const response = await apiClient.put<SevaAdmin>(`/admin/sevas/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/sevas/${id}`);
  },
};

export const socialService = {
  list: async (): Promise<SocialLinkAdminItem[]> => {
    const response = await apiClient.get<SocialLinkAdminItem[]>('/admin/social');
    return response.data;
  },

  create: async (data: SocialLinkUpsert): Promise<SocialLinkAdminItem> => {
    const response = await apiClient.post<SocialLinkAdminItem>('/admin/social', data);
    return response.data;
  },

  update: async (id: string, data: SocialLinkUpsert): Promise<SocialLinkAdminItem> => {
    const response = await apiClient.put<SocialLinkAdminItem>(`/admin/social/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/social/${id}`);
  },
};

export const mathaInfoService = {
  get: async (): Promise<MathaInfoAdminItem> => {
    const response = await apiClient.get<MathaInfoAdminItem>('/admin/temple-info');
    return response.data;
  },

  update: async (data: MathaInfoUpdateRequest): Promise<MathaInfoAdminItem> => {
    const response = await apiClient.put<MathaInfoAdminItem>('/admin/temple-info', data);
    return response.data;
  },
};

export const roomBookingsService = {
  list: async (filters?: { status?: string; from?: string; to?: string }): Promise<RoomBookingSummary[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    
    const response = await apiClient.get<RoomBookingSummary[]>(
      `/admin/room-bookings${params.toString() ? '?' + params.toString() : ''}`
    );
    return response.data;
  },

  get: async (id: string): Promise<RoomBookingDetail> => {
    const response = await apiClient.get<RoomBookingDetail>(`/admin/room-bookings/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, data: UpdateStatusRequest): Promise<ActionResponse> => {
    const response = await apiClient.put<ActionResponse>(`/admin/room-bookings/${id}/status`, data);
    return response.data;
  },

  resendEmail: async (id: string): Promise<ActionResponse> => {
    const response = await apiClient.post<ActionResponse>(`/admin/room-bookings/${id}/resend-email`);
    return response.data;
  },
};

export const sevaOrdersService = {
  list: async (filters?: { status?: string; from?: string; to?: string }): Promise<SevaOrderSummary[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    
    const response = await apiClient.get<SevaOrderSummary[]>(
      `/admin/seva-orders${params.toString() ? '?' + params.toString() : ''}`
    );
    return response.data;
  },

  get: async (id: string): Promise<SevaOrderDetail> => {
    const response = await apiClient.get<SevaOrderDetail>(`/admin/seva-orders/${id}`);
    return response.data;
  },
};

export const galleryService = {
  listAlbums: async (): Promise<AlbumSummary[]> => {
    const response = await apiClient.get<AlbumSummary[]>('/admin/gallery/albums');
    return response.data;
  },

  createAlbum: async (data: CreateAlbum): Promise<AlbumSummary> => {
    const response = await apiClient.post<AlbumSummary>('/admin/gallery/albums', data);
    return response.data;
  },

  updateAlbum: async (id: string, data: CreateAlbum): Promise<AlbumSummary> => {
    const response = await apiClient.put<AlbumSummary>(`/admin/gallery/albums/${id}`, data);
    return response.data;
  },

  deleteAlbum: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/gallery/albums/${id}`);
  },

  addMedia: async (data: CreateMedia): Promise<MediaItem> => {
    const response = await apiClient.post<MediaItem>('/admin/gallery/media', data);
    return response.data;
  },

  deleteMedia: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/gallery/media/${id}`);
  },
};

export const configService = {
  get: async (): Promise<AdminConfig> => {
    const response = await apiClient.get<AdminConfig>('/admin/config');
    return response.data;
  },

  update: async (data: ConfigUpdateRequest): Promise<AdminConfig> => {
    const response = await apiClient.put<AdminConfig>('/admin/config', data);
    return response.data;
  },
};

export const fileUploadService = {
  upload: async (file: File, path: string, onProgress?: (progress: number) => void): Promise<string> => {
        const { getStorage, ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage');
    const storage = getStorage();
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  },

  delete: async (url: string): Promise<void> => {
    const { getStorage, ref, deleteObject } = await import('firebase/storage');
    const storage = getStorage();
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  },
};

export const dashboardService = {
  getStats: async () => {
    try {
            const [sevaOrders, roomBookings] = await Promise.all([
        apiClient.get('/admin/seva-orders').catch(() => ({ data: [] })),
        apiClient.get('/admin/room-bookings').catch(() => ({ data: [] })),
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

            const completedSevas = sevaOrders.data.filter((order: any) => 
        order.status === 'PAID'
      );

      const totalSevas = completedSevas.length;
      
            const totalRevenue = completedSevas.reduce((sum: number, order: any) => 
        sum + ((order.amountInPaise || 0) / 100), 0
      );

            const todaySevas = completedSevas.filter((order: any) => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      }).length;

            const todayRevenue = completedSevas
        .filter((order: any) => {
          const orderDate = new Date(order.createdAt);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === today.getTime();
        })
        .reduce((sum: number, order: any) => sum + ((order.amountInPaise || 0) / 100), 0);

            const pendingBookings = roomBookings.data.filter((booking: any) => 
        booking.status === 'NEW'
      ).length;

            const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentOrders = sevaOrders.data.filter((order: any) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= thirtyDaysAgo;
      });

      const uniqueUsers = new Set(
        recentOrders.map((order: any) => order.uid)
          .filter((uid: any) => uid)
      );
      const activeUsers = uniqueUsers.size;

      return {
        totalSevas,
        totalRevenue,
        activeUsers,
        pendingBookings,
        todaySevas,
        todayRevenue,
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
            return {
        totalSevas: 0,
        totalRevenue: 0,
        activeUsers: 0,
        pendingBookings: 0,
        todaySevas: 0,
        todayRevenue: 0,
      };
    }
  },

  getSevasTrend: async (period: 'week' | 'month' | 'year') => {
    try {
            const response = await apiClient.get('/admin/seva-orders');
      const sevaOrders = response.data.filter((order: any) => 
        order.status === 'PAID'
      );

      const labels: string[] = [];
      const data: number[] = [];
      const now = new Date();

      if (period === 'week') {
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const counts = new Array(7).fill(0);
        
                for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          
          const dayIndex = date.getDay();
          labels.push(dayNames[dayIndex]);
          
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);
          
          const count = sevaOrders.filter((order: any) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= date && orderDate < nextDate;
          }).length;
          
          data.push(count);
        }
      } else if (period === 'month') {
                for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          labels.push(`${date.getDate()}`);
        }
        
        const counts = new Array(30).fill(0);
        
        sevaOrders.forEach((order: any) => {
          const orderDate = new Date(order.createdAt);
          const daysAgo = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysAgo >= 0 && daysAgo < 30) {
            counts[29 - daysAgo]++;
          }
        });
        
        data.push(...counts);
      } else {
                labels.push('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
        const counts = new Array(12).fill(0);
        
        sevaOrders.forEach((order: any) => {
          const orderDate = new Date(order.createdAt);
          if (orderDate.getFullYear() === now.getFullYear()) {
            const month = orderDate.getMonth();
            counts[month]++;
          }
        });
        
        data.push(...counts);
      }

      return {
        labels,
        datasets: [{
          label: 'Sevas Booked',
          data,
          borderColor: '#ff6b00',
          backgroundColor: 'rgba(255, 107, 0, 0.1)',
          tension: 0.4,
        }]
      };
    } catch (error) {
      console.error('Failed to fetch sevas trend:', error);
            const labels = period === 'week' 
        ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        : period === 'month'
        ? Array.from({length: 30}, (_, i) => `${i + 1}`)
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      return {
        labels,
        datasets: [{
          label: 'Sevas Booked',
          data: labels.map(() => 0),
          borderColor: '#ff6b00',
          backgroundColor: 'rgba(255, 107, 0, 0.1)',
          tension: 0.4,
        }]
      };
    }
  },

  getRevenueTrend: async (period: 'week' | 'month' | 'year') => {
    try {
            const response = await apiClient.get('/admin/seva-orders');
      const sevaOrders = response.data.filter((order: any) => 
        order.status === 'PAID'
      );

      const labels: string[] = [];
      const data: number[] = [];
      const now = new Date();

      if (period === 'week') {
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const revenue = new Array(7).fill(0);
        
                for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          
          const dayIndex = date.getDay();
          labels.push(dayNames[dayIndex]);
          
          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);
          
          const rev = sevaOrders
            .filter((order: any) => {
              const orderDate = new Date(order.createdAt);
              return orderDate >= date && orderDate < nextDate;
            })
            .reduce((sum: number, order: any) => sum + ((order.amountInPaise || 0) / 100), 0);
          
          data.push(rev);
        }
      } else if (period === 'month') {
                for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          labels.push(`${date.getDate()}`);
        }
        
        const revenue = new Array(30).fill(0);
        
        sevaOrders.forEach((order: any) => {
          const orderDate = new Date(order.createdAt);
          const daysAgo = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysAgo >= 0 && daysAgo < 30) {
            revenue[29 - daysAgo] += (order.amountInPaise || 0) / 100;
          }
        });
        
        data.push(...revenue);
      } else {
                labels.push('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
        const revenue = new Array(12).fill(0);
        
        sevaOrders.forEach((order: any) => {
          const orderDate = new Date(order.createdAt);
          if (orderDate.getFullYear() === now.getFullYear()) {
            const month = orderDate.getMonth();
            revenue[month] += (order.amountInPaise || 0) / 100;
          }
        });
        
        data.push(...revenue);
      }

      return {
        labels,
        datasets: [{
          label: 'Revenue (₹)',
          data,
          backgroundColor: '#1976d2',
        }]
      };
    } catch (error) {
      console.error('Failed to fetch revenue trend:', error);
            const labels = period === 'week' 
        ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        : period === 'month'
        ? Array.from({length: 30}, (_, i) => `${i + 1}`)
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      return {
        labels,
        datasets: [{
          label: 'Revenue (₹)',
          data: labels.map(() => 0),
          backgroundColor: '#1976d2',
        }]
      };
    }
  },
};


export const userManagementService = {
  promoteToAdmin: async (uid: string): Promise<AdminActionResponse> => {
    const response = await apiClient.post<AdminActionResponse>('/admin/users/promote', { uid });
    return response.data;
  },

  demoteToUser: async (uid: string): Promise<AdminActionResponse> => {
    const response = await apiClient.post<AdminActionResponse>('/admin/users/demote', { uid });
    return response.data;
  },
};