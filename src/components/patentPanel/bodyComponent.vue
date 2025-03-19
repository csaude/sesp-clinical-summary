<template>
  <div class="q-pb-md">
    <!-- Title -->
    <div class="q-mt-md q-mb-md text-center text-h6 text-primary">
      {{ title }}
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="q-my-md text-center">
      <q-spinner-dots color="blue" size="40px" />
    </div>

    <!-- Cards for Clinical Consultation Data -->
    <div v-if="!loading">
      <div v-for="(section, index) in summaryData" :key="index" class="q-mb-md">
        <q-card flat bordered>
          <!-- Section Header -->
          <q-card-section
            class="q-py-sm bg-light-green-1 cursor-pointer"
            @click="toggleSection(index)"
          >
            <div class="row items-center">
              <div class="col text-weight-bold text-h6">
                {{ section.title }}
              </div>
              <div class="col-auto text-caption text-right text-grey">
                Fonte
              </div>
              <q-icon
                :name="
                  collapsedSections[index]
                    ? 'keyboard_arrow_down'
                    : 'keyboard_arrow_up'
                "
                size="sm"
                color="grey"
              />
            </div>
          </q-card-section>

          <q-separator />

          <!-- Section Content -->
          <q-card-section v-show="!collapsedSections[index]">
            <template v-if="section.isList">
              <div v-for="(item, idx) in section.items" :key="idx">
                <div class="row items-center q-mb-sm">
                  <div class="col">
                    <div class="text-caption">{{ item.value }}</div>
                    <div
                      v-if="item.comment"
                      class="text-caption text-grey-7 q-mt-xs"
                    >
                      {{ item.comment }}
                    </div>
                  </div>
                  <div class="col-auto text-caption text-right">
                    <div class="q-mb-xs">
                      <q-badge
                        text-color="blue-grey-10"
                        color="white"
                        class="text-bold"
                      >
                        {{ item.source.form }}
                      </q-badge>
                    </div>
                    <div v-if="item.source.date" class="q-mb-xs">
                      <q-badge
                        text-color="green-10"
                        color="white"
                        class="text-bold"
                      >
                        {{ item.source.date }}
                      </q-badge>
                    </div>
                  </div>
                </div>
                <q-separator
                  v-if="idx < section.items.length - 1"
                  class="q-mb-md"
                />
              </div>
            </template>
            <template v-else>
              <div class="row items-center">
                <div class="col text-caption">
                  {{ section.value || 'Sem dados no SESP' }}
                </div>
                <div class="col-auto text-caption text-right">
                  <div class="q-mb-xs">
                    <q-badge
                      text-color="blue-grey-10"
                      color="white"
                      class="text-bold"
                    >
                      {{ section.source.form }}
                    </q-badge>
                  </div>
                  <div v-if="section.source.date" class="q-mb-xs">
                    <q-badge
                      text-color="green-10"
                      color="white"
                      class="text-bold"
                    >
                      {{ section.source.date }}
                    </q-badge>
                  </div>
                </div>
              </div>
            </template>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, onMounted, onUnmounted } from 'vue';
import { PrivacyScreen } from '@capacitor-community/privacy-screen';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  summaryData: {
    type: Array,
    required: true,
  },
});

const collapsedSections = ref(Array(props.summaryData.length).fill(false));

const emit = defineEmits(['toggle-section']);

function toggleSection(index) {
  collapsedSections.value[index] = !collapsedSections.value[index];
  emit('toggle-section', index);
}

// Watch for changes in summaryData and reset collapsedSections when data updates
watch(
  () => props.summaryData,
  (newData) => {
    collapsedSections.value = Array(newData.length).fill(false);
  },
  { deep: true }
);

// Enable Privacy Screen when the component mounts
onMounted(async () => {
  try {
    await PrivacyScreen.enable();
    console.log('Privacy screen enabled');
  } catch (error) {
    console.error('Error enabling privacy screen:', error);
  }
});

// Optionally disable privacy screen when component is destroyed
onUnmounted(async () => {
  try {
    await PrivacyScreen.disable();
    console.log('Privacy screen disabled');
  } catch (error) {
    console.error('Error disabling privacy screen:', error);
  }
});
</script>

<style scoped>
.q-card {
  border: 1px solid #e0e0e0;
}
.text-h6 {
  font-size: 1.1em;
}
.text-caption {
  font-size: 0.9em;
}
</style>
