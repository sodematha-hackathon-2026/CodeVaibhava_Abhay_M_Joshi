
export interface BaseRecord {
  id: string;
}

export interface AdminConfig {
  id?: number;    enableEvents: boolean;
  enableGallery: boolean;
  enableArtefacts: boolean;
  enableHistory: boolean;
  enableRoomBooking: boolean;
  enableSeva: boolean;
  enableQuiz: boolean;
}

export interface PublicConfig {
  enableEvents: boolean;
  enableGallery: boolean;
  enableArtefacts: boolean;
  enableHistory: boolean;
  enableRoomBooking: boolean;
  enableSeva: boolean;
  enableQuiz: boolean;
}

export interface ConfigUpdateRequest {
  enableEvents: boolean;
  enableGallery: boolean;
  enableArtefacts: boolean;
  enableHistory: boolean;
  enableRoomBooking: boolean;
  enableSeva: boolean;
  enableQuiz: boolean;
}

export type EventType =  'ARADHANA'| 'PARYAYA' | 'UTSAVA' | 'GENERAL';
export type EventScope = 'LOCAL' | 'NATIONAL';

export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;    location: string;
  imageUrl?: string;
  type: EventType;    scope: EventScope;    notifyUsers: boolean;    tithiLabel?: string;    active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUpdateEvent {
  title: string;
  description: string;
  eventDate: string;    location: string;
  imageUrl?: string;
  type: EventType;    scope: EventScope;    notifyUsers: boolean;    tithiLabel?: string;    active: boolean;
}

export type MediaType = 'IMAGE' | 'VIDEO';

export interface AlbumSummary {
  id: string;
  title: string;
  coverImageUrl?: string;
  active: boolean;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  albumId: string;
  type: string;
  title?: string;
  url: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface AlbumDetail extends AlbumSummary {
  description?: string;
  media: MediaItem[];
}

export interface CreateAlbum {
  title: string;
  description?: string;
  coverImageUrl?: string;
  active: boolean;
}

export interface CreateMedia {
  albumId: string;
  type: MediaType;
  title?: string;
  url: string;
  thumbnailUrl?: string;
}

export interface ArtefactAdmin {
  id: string;
  title: string;
  category: string;
  type: string;    description?: string;
  url: string;    thumbnailUrl?: string;
  active: boolean;
  createdAt: string;
}

export interface ArtefactUpsert {
  title: string;
  category: string;
  type: string;    description?: string;
  url: string;
  thumbnailUrl?: string;
  active: boolean;
}

export interface HistoryAdminItem {
  id: string;
  title: string;
  subtitle?: string;    period?: string;    description?: string;    imageUrl?: string;
  sortOrder: number;    active: boolean;
  createdAt: string;
}

export interface HistoryUpsert {
  title: string;
  subtitle?: string;
  period?: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  active: boolean;
}

export interface SevaAdmin {
  id: string;
  title: string;    description?: string;
  amountInPaise: number;    active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SevaUpsert {
  title: string;
  description?: string;
  amountInPaise: number;
  active: boolean;
}

export const paiseToRupees = (paise: number): number => paise / 100;
export const rupeesToPaise = (rupees: number): number => Math.round(rupees * 100);

export interface RoomBookingSummary {
  id: string;
  nameOrMasked: string;    mobile: string;    checkInDate: string;
  peopleCount: number;    consentToStore: boolean;
  status: string;
  createdAt: string;
}

export interface RoomBookingDetail {
  id: string;
  nameOrMasked: string;
  mobile: string;
  emailOrMasked?: string;
  peopleCount: number;
  checkInDate: string;
  notesOrMasked?: string;
  consentToStore: boolean;
  status: string;
  createdAt: string;
}

export interface UpdateStatusRequest {
  status: string;  }

export interface ActionResponse {
  bookingId: string;
  status: string;
}

export interface SevaOrderSummary {
  id: string;
  uid: string;    sevaId: string;
  sevaTitle: string;    amountInPaise: number;    status: string;
  consentToStore: boolean;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SevaOrderDetail {
  id: string;
  uid: string;
  sevaId: string;
  sevaTitle: string;
  amountInPaise: number;
  status: string;
  consentToStore: boolean;
  fullName?: string;
  mobile?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: string;
  updatedAt: string;
}

export type CorrectOption = 'A' | 'B' | 'C' | 'D';

export interface QuestionAdmin {
  id: string;
  questionText: string;    optionA: string;    optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;    active: boolean;
  createdAt: string;
}

export interface QuestionUpsert {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: CorrectOption;
  active: boolean;
}

export interface NewsAdmin {
  id: string;
  title: string;
  imageUrl?: string;
  body?: string;    active: boolean;
  createdAt: string;
}

export interface NewsUpsert {
  title: string;
  imageUrl?: string;
  body?: string;
  active: boolean;
}

export interface FlashAdmin {
  id: string;
  text: string;    active: boolean;
  createdAt: string;
}

export interface FlashUpsert {
  text: string;
  active: boolean;
}

export interface SocialLinkAdminItem {
  id: string;
  platform: string;
  url: string;
  active: boolean;
  createdAt: string;
}

export interface SocialLinkUpsert {
  platform: string;
  url: string;
  active: boolean;
}

export interface MathaInfoAdminItem {
  id: string;
  morningDarshan: string;
  morningPrasada: string;
  eveningDarshan: string;
  eveningPrasada: string;
  updatedAt: string;
}

export interface MathaInfoUpdateRequest {
  morningDarshan: string;
  morningPrasada: string;
  eveningDarshan: string;
  eveningPrasada: string;
}

export interface DashboardStats {
  totalSevas: number;
  totalRevenue: number;
  activeUsers: number;
  pendingBookings: number;
  todaySevas: number;
  todayRevenue: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
  }[];
}

export interface PromoteRequest {
  uid: string;
}

export interface DemoteRequest {
  uid: string;
}

export interface AdminActionResponse {
  uid: string;
  role: string;
}

export interface UserListItem {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: string;
  createdAt?: string;
}