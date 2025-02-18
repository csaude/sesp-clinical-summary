import { BackgroundTask } from '@capawesome/capacitor-background-task';
import api from 'src/services/api/apiService';

const BackgroundTaskService = {
  async startBackgroundTask() {
    // Register a periodic background task
    const taskId = await BackgroundTask.beforeExit(async () => {
      await this.syncReports();
      BackgroundTask.finish({ taskId }); // Notify task completion
    });
  },

  async syncReports() {
    const facilityData = localStorage.getItem('facilities');
    const facilities = facilityData ? JSON.parse(facilityData) : null;

    const unsyncedReports = JSON.parse(
      localStorage.getItem('visualizedPatients')
    )?.filter((item) => item.status === 'not_uploaded');

    if (!unsyncedReports || unsyncedReports.length === 0) {
      return;
    }

    for (const report of unsyncedReports) {
      try {
        const payload = {
          report: report.report,
          unidadeSanitaria: report.unidadeSanitaria,
          userName: report.userName,
          terms: report.terms,
          dateOpened: report.dateOpened,
          applicationVersion: report.applicationVersion,
        };

        const facility = facilities.filter(
          (facility) => facility.key === report.serverKey
        );

        const url = `${facility[0].url}/ws/rest/v1/clinicalsummary`;

        await api.post(url, payload);

        // Mark as uploaded
        report.status = 'uploaded';

        // Update localStorage
        const updatedReports = JSON.parse(
          localStorage.getItem('visualizedPatients')
        ).map((item) =>
          item.dateOpened === report.dateOpened ? report : item
        );
        localStorage.setItem(
          'visualizedPatients',
          JSON.stringify(updatedReports)
        );
      } catch (error) {
        console.error('Error syncing report:', error);
      }
    }
  },
};

export default BackgroundTaskService;
