# Requirements Document

## Introduction

The Data Collection App (DCA) for facial liveness detection has two critical issues affecting data collection quality:

1. **Timestamp Duplication**: The first two color signals in the `freshnessColorSignals` array share identical `colorStartTimestamp` values, causing the black color [0,0,0] and the second color (typically blue [0,0,255]) to have the same timestamp in the JSON output.

2. **Video Truncation**: Recorded video files (.webm) are being cut short, with actual durations (~5 seconds) not matching the expected duration indicated in JSON files (8 seconds), resulting in incomplete color flashing sequences.

These issues compromise the integrity of the collected liveness data and must be resolved to ensure accurate facial liveness verification.

## Requirements

### Requirement 1: Fix Timestamp Duplication in Color Signals

**User Story:** As a data collection engineer, I want each color signal in the freshnessColorSignals array to have a unique and accurate colorStartTimestamp, so that I can properly analyze the timing of color transitions during liveness checks.

#### Acceptance Criteria

1. WHEN the color sequence display begins THEN the system SHALL assign a unique timestamp to each color signal based on when that color actually starts displaying
2. WHEN the first color (black [0,0,0]) is displayed THEN the system SHALL record its colorStartTimestamp at the moment it begins
3. WHEN the second color (typically blue [0,0,255]) is displayed THEN the system SHALL record its colorStartTimestamp at the moment it begins, which MUST be different from the first color's timestamp
4. WHEN the JSON output is generated THEN each entry in the freshnessColorSignals array SHALL have a colorStartTimestamp that is greater than or equal to the previous entry's timestamp
5. IF two colors are displayed sequentially THEN their colorStartTimestamp values SHALL differ by at least the duration of one color display cycle

### Requirement 2: Fix Video Recording Duration

**User Story:** As a data collection engineer, I want recorded video files to capture the complete color flashing sequence as indicated in the JSON metadata, so that I have complete video data for analysis and verification.

#### Acceptance Criteria

1. WHEN a liveness check session begins recording THEN the system SHALL continue recording until all color signals have been displayed
2. WHEN the JSON metadata indicates an 8-second video duration THEN the actual .webm file SHALL be at least 8 seconds long
3. WHEN the last color signal completes its display cycle THEN the system SHALL ensure the video recording captures this final color before stopping
4. IF the video recording is stopped prematurely THEN the system SHALL log an error and attempt to extend the recording duration
5. WHEN the recording completes THEN the system SHALL verify that the video duration matches the expected duration based on the color sequence length before finalizing the file

### Requirement 3: Ensure Timestamp and Video Duration Consistency

**User Story:** As a data collection engineer, I want the timestamps in the JSON output to align with the actual video content, so that I can accurately correlate color signals with video frames.

#### Acceptance Criteria

1. WHEN analyzing the JSON and video files THEN the colorStartTimestamp values SHALL correspond to the actual moments when colors appear in the video
2. WHEN the video duration is determined THEN it SHALL be based on the last color signal's timestamp plus its display duration
3. IF there is a discrepancy between JSON timestamps and video content THEN the system SHALL prioritize video accuracy and adjust timestamps accordingly
4. WHEN the recording session ends THEN the system SHALL validate that all color signals recorded in the JSON were captured in the video file
