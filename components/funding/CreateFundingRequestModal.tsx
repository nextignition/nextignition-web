import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { X, DollarSign, FileText, CheckCircle, Upload, Video, Plus, Trash2 } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, TYPOGRAPHY } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { usePitchMaterials } from '@/hooks/usePitchMaterials';
import { useNotification } from '@/hooks/useNotification';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CreateFundingRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editingRequestId?: string;
}

export function CreateFundingRequestModal({
  visible,
  onClose,
  editingRequestId,
  onSuccess,
}: CreateFundingRequestModalProps) {
  const { user, profile } = useAuth();
  const params = useLocalSearchParams();
  const { pitchDecks, pitchVideos, refresh: refreshPitchMaterials } = usePitchMaterials();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [startupId, setStartupId] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initial form data
  const initialFormData = {
    title: '',
    amountRequested: '',
    valuation: '',
    equityPercentage: '',
    revenue: '',
    growthRate: '',
    minInvestment: '',
    maxInvestment: '',
    teamSize: '',
    mrr: '',
    arr: '',
    usersCount: '',
    customersCount: '',
    selectedPitchDeck: '',
    selectedPitchVideo: '',
  };
  
  // Use ref to preserve form data when navigating away
  const formDataRef = useRef(initialFormData);
  
  const [formData, setFormData] = useState(initialFormData);
  
  // Sync formData to ref whenever it changes
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Check if returning from upload pages - restore form data
  useEffect(() => {
    const restoreFormData = async () => {
      if (visible && params.returnTo === 'funding-request' && params.preserveForm === 'true') {
        // Refresh pitch materials first to ensure latest uploads are available
        refreshPitchMaterials();
        
        // Small delay to ensure pitch materials are loaded
        setTimeout(async () => {
          try {
            // Try to restore from AsyncStorage first (works on both web and mobile)
            const savedData = await AsyncStorage.getItem('fundingRequestFormData');
            if (savedData) {
              const parsedData = JSON.parse(savedData);
              console.log('Restoring form data from AsyncStorage:', parsedData);
              setFormData(parsedData);
              formDataRef.current = parsedData;
              // Clear AsyncStorage after restoring
              await AsyncStorage.removeItem('fundingRequestFormData');
            } else {
              // Fallback to ref
              console.log('No saved data, using ref:', formDataRef.current);
              setFormData(formDataRef.current);
            }
          } catch (error) {
            console.error('Error restoring form data:', error);
            // Fallback to ref
            setFormData(formDataRef.current);
          }
        }, 500);
        
        // Clear the return param
        router.setParams({ returnTo: undefined, preserveForm: undefined });
      }
    };
    
    restoreFormData();
  }, [visible, params.returnTo, params.preserveForm, refreshPitchMaterials]);
  
  // Only reset form when modal is closed AND we're not preserving form
  useEffect(() => {
    if (!visible && params.preserveForm !== 'true') {
      // Reset form only when modal is completely closed and not preserving
      // Also clear AsyncStorage and errors
      AsyncStorage.removeItem('fundingRequestFormData').catch(() => {
        // Ignore errors
      });
      setFormData(initialFormData);
      formDataRef.current = initialFormData;
      setErrors({});
    }
  }, [visible, params.preserveForm]);

  // Debug: Log when modal visibility changes
  useEffect(() => {
    console.log('CreateFundingRequestModal visibility changed:', visible);
  }, [visible]);

  // Fetch user's startup profile and existing request if editing
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      try {
        setFetching(true);
        
        // Fetch startup
        const { data: startupData, error: startupError } = await supabase
          .from('startup_profiles')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle();
        
        if (startupError) throw startupError;
        if (startupData) {
          setStartupId(startupData.id);
        }

        // If editing, fetch existing request
        if (editingRequestId) {
          const { data: requestData, error: requestError } = await supabase
            .from('funding_requests')
            .select('*')
            .eq('id', editingRequestId)
            .eq('founder_id', user.id)
            .single();

          if (requestError) throw requestError;
          
          if (requestData) {
            const fetchedData = {
              title: requestData.title || '',
              amountRequested: requestData.amount_requested?.toString() || '',
              valuation: requestData.valuation?.toString() || '',
              equityPercentage: requestData.equity_percentage?.toString() || '',
              revenue: requestData.revenue?.toString() || '',
              growthRate: requestData.growth_rate?.toString() || '',
              minInvestment: requestData.min_investment?.toString() || '',
              maxInvestment: requestData.max_investment?.toString() || '',
              teamSize: requestData.team_size?.toString() || '',
              mrr: requestData.mrr?.toString() || '',
              arr: requestData.arr?.toString() || '',
              usersCount: requestData.users_count?.toString() || '',
              customersCount: requestData.customers_count?.toString() || '',
              selectedPitchDeck: requestData.pitch_material_id || '',
              selectedPitchVideo: requestData.pitch_video_id || '',
            };
            setFormData(fetchedData);
            formDataRef.current = fetchedData;
          }
        } else if (!editingRequestId && params.returnTo !== 'funding-request') {
          // If creating new (not editing) and not returning from upload, 
          // check if we have saved form data from previous session
          try {
            const savedData = await AsyncStorage.getItem('fundingRequestFormData');
            if (savedData) {
              const parsedData = JSON.parse(savedData);
              setFormData(parsedData);
              formDataRef.current = parsedData;
            }
          } catch (err) {
            // Ignore errors when restoring - form will be empty
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setFetching(false);
      }
    };

    if (visible && user?.id) {
      fetchData();
      refreshPitchMaterials();
    } else if (!visible) {
      // Reset form when modal closes (only if not editing)
      if (!editingRequestId) {
        setFormData(initialFormData);
        formDataRef.current = initialFormData;
      }
    }
  }, [visible, user?.id, editingRequestId, refreshPitchMaterials]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.amountRequested || parseFloat(formData.amountRequested) <= 0) {
      newErrors.amountRequested = 'Please enter a valid funding amount';
    }

    if (!formData.selectedPitchDeck) {
      newErrors.selectedPitchDeck = 'Please select or upload a pitch deck';
    }

    // Validate equity percentage (0-100)
    if (formData.equityPercentage) {
      const equity = parseFloat(formData.equityPercentage);
      if (isNaN(equity) || equity < 0 || equity > 100) {
        newErrors.equityPercentage = 'Equity percentage must be between 0 and 100';
      }
    }

    // Validate growth rate (0-999.99 to match database precision)
    if (formData.growthRate) {
      const growth = parseFloat(formData.growthRate);
      if (isNaN(growth) || growth < 0 || growth > 999.99) {
        newErrors.growthRate = 'Growth rate must be between 0 and 999.99';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setErrors({});

    if (!user?.id || !startupId) {
      showError('Please complete your startup profile first');
      return;
    }

    // Validate form
    if (!validateForm()) {
      showError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // Ensure numeric values are within database constraints
      const equityPercentage = formData.equityPercentage 
        ? Math.min(100, Math.max(0, parseFloat(formData.equityPercentage))) 
        : null;
      
      const growthRate = formData.growthRate 
        ? Math.min(999.99, Math.max(0, parseFloat(formData.growthRate))) 
        : 0;

      const requestData: any = {
        startup_id: startupId,
        founder_id: user.id,
        title: formData.title.trim(),
        amount_requested: parseFloat(formData.amountRequested),
        currency: 'USD',
        status: editingRequestId ? undefined : 'pending',
        pitch_material_id: formData.selectedPitchDeck,
        valuation: formData.valuation ? parseFloat(formData.valuation) : null,
        equity_percentage: equityPercentage,
        revenue: formData.revenue ? parseFloat(formData.revenue) : 0,
        growth_rate: growthRate,
        min_investment: formData.minInvestment ? parseFloat(formData.minInvestment) : null,
        max_investment: formData.maxInvestment ? parseFloat(formData.maxInvestment) : null,
        team_size: formData.teamSize ? parseInt(formData.teamSize) : 1,
        mrr: formData.mrr ? parseFloat(formData.mrr) : null,
        arr: formData.arr ? parseFloat(formData.arr) : null,
        users_count: formData.usersCount ? parseInt(formData.usersCount) : null,
        customers_count: formData.customersCount ? parseInt(formData.customersCount) : null,
        pitch_video_id: formData.selectedPitchVideo || null,
      };

      let result;
      if (editingRequestId) {
        const { data, error } = await supabase
          .from('funding_requests')
          .update(requestData)
          .eq('id', editingRequestId)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('funding_requests')
          .insert(requestData)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }

      showSuccess(editingRequestId ? 'Funding request updated successfully!' : 'Funding request created successfully!');
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form if creating new
      if (!editingRequestId) {
        setFormData({
          title: '',
          amountRequested: '',
          valuation: '',
          equityPercentage: '',
          revenue: '',
          growthRate: '',
          minInvestment: '',
          maxInvestment: '',
          teamSize: '',
          mrr: '',
          arr: '',
          usersCount: '',
          customersCount: '',
          selectedPitchDeck: '',
          selectedPitchVideo: '',
        });
      }
      
      onClose();
    } catch (err: any) {
      console.error('Error saving funding request:', err);
      showError(err.message || 'Failed to save funding request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    return numericValue;
  };

  const formatNumber = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    return numericValue;
  };

  const handleUploadPitchDeck = async () => {
    try {
      // Save current form state to ref and AsyncStorage before navigating
      formDataRef.current = formData;
      
      // Save to AsyncStorage for persistence across navigation (works on both web and mobile)
      await AsyncStorage.setItem('fundingRequestFormData', JSON.stringify(formData));
      
      // Close modal first to allow navigation
      onClose();
      
      // Navigate immediately after closing
      router.push({
        pathname: '/(tabs)/pitch-upload',
        params: { 
          returnTo: 'funding-request',
          preserveForm: 'true',
          requestId: editingRequestId || 'new',
        },
      });
    } catch (error) {
      console.error('Error navigating to pitch upload:', error);
      showError('Failed to navigate. Please try again.');
    }
  };

  const handleRecordVideo = async () => {
    try {
      // Save current form state to ref and AsyncStorage before navigating
      formDataRef.current = formData;
      
      // Save to AsyncStorage for persistence across navigation (works on both web and mobile)
      await AsyncStorage.setItem('fundingRequestFormData', JSON.stringify(formData));
      
      // Close modal first to allow navigation
      onClose();
      
      // Navigate immediately after closing
      router.push({
        pathname: '/(tabs)/pitch-video',
        params: { 
          returnTo: 'funding-request',
          preserveForm: 'true',
          requestId: editingRequestId || 'new',
        },
      });
    } catch (error) {
      console.error('Error navigating to pitch video:', error);
      showError('Failed to navigate. Please try again.');
    }
  };

  if (fetching) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {editingRequestId ? 'Edit Funding Request' : 'Create Funding Request'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Pitch Materials Section - Moved to Top */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pitch Materials</Text>
            <Text style={styles.sectionDescription}>
              Upload your pitch deck and record a pitch video to attract investors.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  Pitch Deck <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.uploadActionButton}
                  onPress={handleUploadPitchDeck}
                  disabled={loading}>
                  <Plus size={16} color={COLORS.primary} />
                  <Text style={styles.uploadActionText}>Upload</Text>
                </TouchableOpacity>
              </View>
              {errors.selectedPitchDeck && (
                <Text style={styles.errorText}>{errors.selectedPitchDeck}</Text>
              )}
              {pitchDecks.length === 0 ? (
                <View style={styles.noMaterialContainer}>
                  <FileText size={32} color={COLORS.textSecondary} />
                  <Text style={styles.noMaterialText}>No pitch decks uploaded</Text>
                  <Text style={styles.noMaterialHint}>
                    Click "Upload" to add a pitch deck
                  </Text>
                </View>
              ) : (
                <View style={styles.materialList}>
                  {pitchDecks.map((deck) => (
                    <TouchableOpacity
                      key={deck.id}
                      style={[
                        styles.materialOption,
                        formData.selectedPitchDeck === deck.id && styles.materialOptionSelected,
                        errors.selectedPitchDeck && styles.materialOptionError,
                      ]}
                      onPress={() => {
                        setFormData({ ...formData, selectedPitchDeck: deck.id });
                        if (errors.selectedPitchDeck) {
                          setErrors({ ...errors, selectedPitchDeck: '' });
                        }
                      }}
                      disabled={loading}>
                      <View style={styles.materialOptionContent}>
                        <FileText
                          size={20}
                          color={formData.selectedPitchDeck === deck.id ? COLORS.primary : COLORS.textSecondary}
                        />
                        <View style={styles.materialInfo}>
                          <Text
                            style={[
                              styles.materialName,
                              formData.selectedPitchDeck === deck.id && styles.materialNameSelected,
                            ]}>
                            {deck.filename || 'Pitch Deck'}
                          </Text>
                          <Text style={styles.materialMeta}>
                            {deck.visibility === 'public' ? 'Public' : 'Private'} •{' '}
                            {deck.pages ? `${deck.pages} pages` : 'PDF'}
                          </Text>
                        </View>
                        {formData.selectedPitchDeck === deck.id && (
                          <CheckCircle size={20} color={COLORS.primary} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Pitch Video</Text>
                <TouchableOpacity
                  style={styles.uploadActionButton}
                  onPress={handleRecordVideo}
                  disabled={loading}>
                  <Video size={16} color={COLORS.primary} />
                  <Text style={styles.uploadActionText}>Record</Text>
                </TouchableOpacity>
              </View>
              {pitchVideos.length === 0 ? (
                <View style={styles.noMaterialContainer}>
                  <Video size={32} color={COLORS.textSecondary} />
                  <Text style={styles.noMaterialText}>No pitch videos recorded</Text>
                  <Text style={styles.noMaterialHint}>
                    Click "Record" to record a pitch video
                  </Text>
                </View>
              ) : (
                <View style={styles.materialList}>
                  {pitchVideos.map((video) => (
                    <TouchableOpacity
                      key={video.id}
                      style={[
                        styles.materialOption,
                        formData.selectedPitchVideo === video.id && styles.materialOptionSelected,
                      ]}
                      onPress={() => setFormData({ ...formData, selectedPitchVideo: video.id })}
                      disabled={loading}>
                      <View style={styles.materialOptionContent}>
                        <Video
                          size={20}
                          color={formData.selectedPitchVideo === video.id ? COLORS.primary : COLORS.textSecondary}
                        />
                        <View style={styles.materialInfo}>
                          <Text
                            style={[
                              styles.materialName,
                              formData.selectedPitchVideo === video.id && styles.materialNameSelected,
                            ]}>
                            {video.filename || 'Pitch Video'}
                          </Text>
                          <Text style={styles.materialMeta}>
                            {video.visibility === 'public' ? 'Public' : 'Private'} • Video
                          </Text>
                        </View>
                        {formData.selectedPitchVideo === video.id && (
                          <CheckCircle size={20} color={COLORS.primary} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <Text style={styles.sectionDescription}>
              Provide basic details about your funding request.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Title <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                placeholder="e.g., Seed Round - $500K"
                placeholderTextColor={COLORS.textSecondary}
                value={formData.title}
                onChangeText={(text) => {
                  setFormData({ ...formData, title: text });
                  if (errors.title) {
                    setErrors({ ...errors, title: '' });
                  }
                }}
                editable={!loading}
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Amount Requested (USD) <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.amountInputContainer, errors.amountRequested && styles.inputError]}>
                <DollarSign size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.amountInput}
                  placeholder="500000"
                  placeholderTextColor={COLORS.textSecondary}
                  value={formData.amountRequested}
                  onChangeText={(text) => {
                    const formatted = formatCurrency(text);
                    setFormData({ ...formData, amountRequested: formatted });
                    if (errors.amountRequested) {
                      setErrors({ ...errors, amountRequested: '' });
                    }
                  }}
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
              {errors.amountRequested && <Text style={styles.errorText}>{errors.amountRequested}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Valuation (USD)</Text>
              <View style={styles.amountInputContainer}>
                <DollarSign size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.amountInput}
                  placeholder="2500000"
                  placeholderTextColor={COLORS.textSecondary}
                  value={formData.valuation}
                  onChangeText={(text) => {
                    const formatted = formatCurrency(text);
                    setFormData({ ...formData, valuation: formatted });
                  }}
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Equity Offered (%)</Text>
              <TextInput
                style={[styles.input, errors.equityPercentage && styles.inputError]}
                placeholder="20"
                placeholderTextColor={COLORS.textSecondary}
                value={formData.equityPercentage}
                onChangeText={(text) => {
                  const formatted = formatNumber(text);
                  setFormData({ ...formData, equityPercentage: formatted });
                  if (errors.equityPercentage) {
                    setErrors({ ...errors, equityPercentage: '' });
                  }
                }}
                keyboardType="numeric"
                editable={!loading}
              />
              {errors.equityPercentage && <Text style={styles.errorText}>{errors.equityPercentage}</Text>}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Investment Details</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Min Investment (USD)</Text>
                <View style={styles.amountInputContainer}>
                  <DollarSign size={20} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.amountInput}
                    placeholder="5000"
                    placeholderTextColor={COLORS.textSecondary}
                    value={formData.minInvestment}
                    onChangeText={(text) => {
                      const formatted = formatCurrency(text);
                      setFormData({ ...formData, minInvestment: formatted });
                    }}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Max Investment (USD)</Text>
                <View style={styles.amountInputContainer}>
                  <DollarSign size={20} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.amountInput}
                    placeholder="50000"
                    placeholderTextColor={COLORS.textSecondary}
                    value={formData.maxInvestment}
                    onChangeText={(text) => {
                      const formatted = formatCurrency(text);
                      setFormData({ ...formData, maxInvestment: formatted });
                    }}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Metrics</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Revenue (USD)</Text>
              <View style={styles.amountInputContainer}>
                <DollarSign size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.amountInput}
                  placeholder="0"
                  placeholderTextColor={COLORS.textSecondary}
                  value={formData.revenue}
                  onChangeText={(text) => {
                    const formatted = formatCurrency(text);
                    setFormData({ ...formData, revenue: formatted });
                  }}
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Growth Rate (% YoY)</Text>
              <TextInput
                style={[styles.input, errors.growthRate && styles.inputError]}
                placeholder="0"
                placeholderTextColor={COLORS.textSecondary}
                value={formData.growthRate}
                onChangeText={(text) => {
                  const formatted = formatNumber(text);
                  setFormData({ ...formData, growthRate: formatted });
                  if (errors.growthRate) {
                    setErrors({ ...errors, growthRate: '' });
                  }
                }}
                keyboardType="numeric"
                editable={!loading}
              />
              {errors.growthRate && <Text style={styles.errorText}>{errors.growthRate}</Text>}
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>MRR (USD)</Text>
                <View style={styles.amountInputContainer}>
                  <DollarSign size={20} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0"
                    placeholderTextColor={COLORS.textSecondary}
                    value={formData.mrr}
                    onChangeText={(text) => {
                      const formatted = formatCurrency(text);
                      setFormData({ ...formData, mrr: formatted });
                    }}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>ARR (USD)</Text>
                <View style={styles.amountInputContainer}>
                  <DollarSign size={20} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0"
                    placeholderTextColor={COLORS.textSecondary}
                    value={formData.arr}
                    onChangeText={(text) => {
                      const formatted = formatCurrency(text);
                      setFormData({ ...formData, arr: formatted });
                    }}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Users</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={COLORS.textSecondary}
                  value={formData.usersCount}
                  onChangeText={(text) => {
                    const formatted = formatNumber(text);
                    setFormData({ ...formData, usersCount: formatted });
                  }}
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Customers</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={COLORS.textSecondary}
                  value={formData.customersCount}
                  onChangeText={(text) => {
                    const formatted = formatNumber(text);
                    setFormData({ ...formData, customersCount: formatted });
                  }}
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Team Size</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                placeholderTextColor={COLORS.textSecondary}
                value={formData.teamSize}
                onChangeText={(text) => {
                  const formatted = formatNumber(text);
                  setFormData({ ...formData, teamSize: formatted });
                }}
                keyboardType="numeric"
                editable={!loading}
              />
            </View>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={loading ? (editingRequestId ? 'Updating...' : 'Creating...') : (editingRequestId ? 'Update Request' : 'Create Funding Request')}
            onPress={handleSubmit}
            disabled={loading}
            style={styles.submitButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  sectionDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  form: {
    padding: SPACING.lg,
    gap: SPACING.xl,
  },
  inputGroup: {
    gap: SPACING.sm,
  },
  inputRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_WEIGHTS.medium,
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  required: {
    color: COLORS.error,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  amountInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  uploadActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.sm,
  },
  uploadActionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontFamily: FONT_WEIGHTS.bold,
  },
  materialList: {
    gap: SPACING.sm,
  },
  materialOption: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  materialOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  materialOptionError: {
    borderColor: COLORS.error,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs / 2,
  },
  materialOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  materialInfo: {
    flex: 1,
    gap: SPACING.xs / 2,
  },
  materialName: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  materialNameSelected: {
    color: COLORS.primary,
  },
  materialMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  noMaterialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  noMaterialText: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_WEIGHTS.medium,
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
  },
  noMaterialHint: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: FONT_SIZES.sm,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  submitButton: {
    width: '100%',
  },
});
