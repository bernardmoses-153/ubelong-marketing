// API client for uBelong backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface ApiError {
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: ApiError = {
        message: errorData.detail || errorData.message || 'An error occurred',
        status: response.status,
        details: errorData,
      };
      throw error;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();

// Auth API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  patient_id: string | null;
  role: 'patient' | 'caregiver' | 'doctor' | 'admin';
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
}

export const authApi = {
  login: (data: LoginRequest) => api.post<TokenResponse>('/auth/login', data),
  logout: () => api.post<{ message: string }>('/auth/logout'),
  me: () => api.get<UserProfile>('/auth/me'),
  refresh: (refreshToken: string) => api.post<TokenResponse>('/auth/refresh', { refresh_token: refreshToken }),
};

// Patient API
export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string;
  city: string;
  blood_group: string | null;
  phone: string;
  email: string | null;
  emergency_contact: string | null;
  profile_image_name: string | null;
  drift_score?: number;
  created_at: string;
  updated_at: string;
}

export interface PatientSummary {
  patient: Patient;
  active_conditions_count: number;
  active_medications_count: number;
  upcoming_appointments_count: number;
  has_health_profile: boolean;
  last_vitals_update: string | null;
}

export const patientsApi = {
  list: (params?: { limit?: number; offset?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    if (params?.search) searchParams.set('search', params.search);
    const query = searchParams.toString();
    return api.get<Patient[]>(`/patients/${query ? `?${query}` : ''}`);
  },
  get: (id: string) => api.get<Patient>(`/patients/${id}`),
  getSummary: (id: string) => api.get<PatientSummary>(`/patients/${id}/summary`),
};

// Lab Reports API
export type LabCategory =
  | 'hematology'
  | 'biochemistry'
  | 'immunology'
  | 'microbiology'
  | 'endocrinology'
  | 'lipid_profile'
  | 'liver_function'
  | 'kidney_function'
  | 'thyroid_function'
  | 'urine_analysis'
  | 'other';

export type LabFlag = 'normal' | 'low' | 'high' | 'critical_low' | 'critical_high';

export interface LabTest {
  id: string;
  test_name: string;
  category: LabCategory;
  value: number;
  unit: string;
  reference_min: number | null;
  reference_max: number | null;
  flag: LabFlag | null;
  notes: string | null;
}

export interface LabReport {
  id: string;
  patient_id: string;
  report_date: string;
  lab_name: string | null;
  ordering_doctor: string | null;
  file_url: string | null;
  summary: string | null;
  tests: LabTest[];
  created_at: string;
  updated_at: string;
}

export const labReportsApi = {
  list: (patientId: string, params?: { limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    const query = searchParams.toString();
    return api.get<LabReport[]>(`/patients/${patientId}/lab-reports${query ? `?${query}` : ''}`);
  },
  get: (patientId: string, reportId: string) =>
    api.get<LabReport>(`/patients/${patientId}/lab-reports/${reportId}`),
};

// SOAP Notes API
export interface SOAPNote {
  id: string;
  patient_id: string;
  encounter_date: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  author_id: string | null;
  author_name?: string;
  is_ai_generated: boolean;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSOAPNoteRequest {
  encounter_date: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export const soapNotesApi = {
  list: (patientId: string, params?: { limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    const query = searchParams.toString();
    return api.get<SOAPNote[]>(`/patients/${patientId}/soap-notes${query ? `?${query}` : ''}`);
  },
  get: (patientId: string, noteId: string) =>
    api.get<SOAPNote>(`/patients/${patientId}/soap-notes/${noteId}`),
  create: (patientId: string, data: CreateSOAPNoteRequest) =>
    api.post<SOAPNote>(`/patients/${patientId}/soap-notes`, { ...data, patient_id: patientId }),
};

// Meal Plans API
export type MealType = 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner' | 'evening_snack';
export type GlycemicIndex = 'low' | 'medium' | 'high';

export interface Meal {
  id: string;
  meal_type: MealType;
  name: string;
  description: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  glycemic_index: GlycemicIndex | null;
  ingredients: string[] | null;
  health_notes: string | null;
  prep_time_minutes: number | null;
  is_completed: boolean;
}

export interface DailyMealPlan {
  id: string;
  plan_date: string;
  day_number: number;
  total_calories: number | null;
  total_protein_g: number | null;
  total_carbs_g: number | null;
  total_fat_g: number | null;
  notes: string | null;
  meals: Meal[];
}

export interface MealPlan {
  id: string;
  patient_id: string;
  title: string | null;
  description: string | null;
  start_date: string;
  end_date: string;
  generated_by: string | null;
  is_active: boolean;
  daily_plans: DailyMealPlan[];
  created_at: string;
  updated_at: string;
}

export interface UpdateMealRequest {
  name?: string;
  description?: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  health_notes?: string;
  is_completed?: boolean;
}

export const mealPlansApi = {
  getCurrent: (patientId: string) =>
    api.get<MealPlan>(`/patients/${patientId}/meal-plans/current`),
  list: (patientId: string, params?: { is_active?: boolean; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.is_active !== undefined) searchParams.set('is_active', String(params.is_active));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    const query = searchParams.toString();
    return api.get<MealPlan[]>(`/patients/${patientId}/meal-plans${query ? `?${query}` : ''}`);
  },
  updateMeal: (patientId: string, planId: string, mealId: string, data: UpdateMealRequest) =>
    api.patch<Meal>(`/patients/${patientId}/meal-plans/${planId}/meals/${mealId}`, data),
};

// Medications API
export type MedicationFrequency =
  | 'once_daily'
  | 'twice_daily'
  | 'thrice_daily'
  | 'four_times_daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'as_needed';

export interface Medication {
  id: string;
  patient_id: string;
  name: string;
  generic_name: string | null;
  dosage: string;
  frequency: MedicationFrequency;
  route: string | null;
  start_date: string;
  end_date: string | null;
  prescribing_doctor: string | null;
  pharmacy: string | null;
  instructions: string | null;
  side_effects: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateMedicationRequest {
  name?: string;
  generic_name?: string;
  dosage?: string;
  frequency?: MedicationFrequency;
  route?: string;
  start_date?: string;
  end_date?: string;
  prescribing_doctor?: string;
  pharmacy?: string;
  instructions?: string;
  side_effects?: string;
  is_active?: boolean;
}

export const medicationsApi = {
  list: (patientId: string, params?: { is_active?: boolean; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.is_active !== undefined) searchParams.set('is_active', String(params.is_active));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    const query = searchParams.toString();
    return api.get<Medication[]>(`/patients/${patientId}/medications${query ? `?${query}` : ''}`);
  },
  get: (patientId: string, medicationId: string) =>
    api.get<Medication>(`/patients/${patientId}/medications/${medicationId}`),
  update: (patientId: string, medicationId: string, data: UpdateMedicationRequest) =>
    api.patch<Medication>(`/patients/${patientId}/medications/${medicationId}`, data),
  create: (patientId: string, data: Omit<Medication, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<Medication>(`/patients/${patientId}/medications`, data),
};

// Exercise Plans API
export type ExerciseCategory = 'upper_body' | 'lower_body' | 'core' | 'full_body' | 'cardio' | 'stretching' | 'breathing';
export type ExerciseIntensity = 'low' | 'moderate' | 'high';
export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'balance' | 'physiotherapy' | 'yoga' | 'walking' | 'swimming' | 'mixed';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  intensity: ExerciseIntensity;
  duration_minutes: number | null;
  sets: number | null;
  reps: number | null;
  rest_seconds: number | null;
  calories_burned: number | null;
  instructions: string | null;
  video_url: string | null;
  is_completed: boolean;
  display_order: number;
}

export interface DailyWorkout {
  id: string;
  workout_date: string;
  day_number: number;
  workout_type: WorkoutType;
  total_duration_minutes: number | null;
  total_calories_burned: number | null;
  notes: string | null;
  exercises: Exercise[];
}

export interface ExercisePlan {
  id: string;
  patient_id: string;
  title: string | null;
  description: string | null;
  start_date: string;
  end_date: string;
  generated_by: string | null;
  is_active: boolean;
  daily_workouts: DailyWorkout[];
  created_at: string;
  updated_at: string;
}

export interface UpdateExerciseRequest {
  name?: string;
  category?: ExerciseCategory;
  intensity?: ExerciseIntensity;
  duration_minutes?: number;
  sets?: number;
  reps?: number;
  rest_seconds?: number;
  calories_burned?: number;
  instructions?: string;
  video_url?: string;
  is_completed?: boolean;
  display_order?: number;
}

export const exercisePlansApi = {
  getCurrent: (patientId: string) =>
    api.get<ExercisePlan>(`/patients/${patientId}/exercise/current`),
  list: (patientId: string, params?: { limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.offset) searchParams.set('offset', String(params.offset));
    const query = searchParams.toString();
    return api.get<ExercisePlan[]>(`/patients/${patientId}/exercise/plans${query ? `?${query}` : ''}`);
  },
  updateExercise: (patientId: string, exerciseId: string, data: UpdateExerciseRequest) =>
    api.patch<Exercise>(`/patients/${patientId}/exercise/exercises/${exerciseId}`, data),
};
