import type { ConcernId } from './concerns';
export type QuestionDefinition = { id: string; concernId: ConcernId; label: string; type: 'single' | 'multi'; options: { id: string; label: string }[]; allowSkip: true };
export const questions: QuestionDefinition[] = [
  {
    "id": "body_acne_location",
    "concernId": "body_acne_marks",
    "label": "Where do you notice the concern?",
    "type": "multi",
    "options": [
      {
        "id": "back",
        "label": "Back"
      },
      {
        "id": "chest",
        "label": "Chest"
      },
      {
        "id": "shoulders",
        "label": "Shoulders"
      },
      {
        "id": "other_area",
        "label": "Other area"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "body_acne_goal",
    "concernId": "body_acne_marks",
    "label": "What is your concern?",
    "type": "single",
    "options": [
      {
        "id": "active_bumps",
        "label": "Active Body Acne"
      },
      {
        "id": "marks_left_behind",
        "label": "Acne Marks"
      },
      {
        "id": "both",
        "label": "Both"
      },
      {
        "id": "not_sure",
        "label": "Not sure"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "body_acne_duration",
    "concernId": "body_acne_marks",
    "label": "How long have you noticed it?",
    "type": "single",
    "options": [
      {
        "id": "less_than_1_month",
        "label": "Less than a month"
      },
      {
        "id": "1_to_3_months",
        "label": "1–3 months"
      },
      {
        "id": "more_than_3_months",
        "label": "More than 3 months"
      },
      {
        "id": "not_sure",
        "label": "Not sure"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "bumpy_location",
    "concernId": "strawberry_bumpy_skin",
    "label": "Where do you notice the bumps or dots?",
    "type": "multi",
    "options": [
      {
        "id": "legs",
        "label": "Legs"
      },
      {
        "id": "arms",
        "label": "Arms"
      },
      {
        "id": "another_area",
        "label": "Another area"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "bumpy_goal",
    "concernId": "strawberry_bumpy_skin",
    "label": "What would you like help with?",
    "type": "single",
    "options": [
      {
        "id": "visible_dots",
        "label": "Visible dots"
      },
      {
        "id": "rough_texture",
        "label": "Rough texture"
      },
      {
        "id": "both",
        "label": "Both"
      },
      {
        "id": "not_sure",
        "label": "Not sure"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "bumpy_dryness",
    "concernId": "strawberry_bumpy_skin",
    "label": "Does your skin usually feel dry in that area?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Yes"
      },
      {
        "id": "no",
        "label": "No"
      },
      {
        "id": "not_sure",
        "label": "Not sure"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "bumpy_pain_itch",
    "concernId": "strawberry_bumpy_skin",
    "label": "Are the bumps painful or itchy?",
    "type": "single",
    "options": [
      {
        "id": "yes",
        "label": "Yes"
      },
      {
        "id": "no",
        "label": "No"
      },
      {
        "id": "not_sure",
        "label": "Not sure"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "body_pigmentation_location",
    "concernId": "body_pigmentation",
    "label": "Where would you like help?",
    "type": "single",
    "options": [
      {
        "id": "elbows",
        "label": "Elbows"
      },
      {
        "id": "knees",
        "label": "Knees"
      },
      {
        "id": "neck",
        "label": "Neck"
      },
      {
        "id": "more_than_one_area",
        "label": "More than one area"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "body_pigmentation_description",
    "concernId": "body_pigmentation",
    "label": "Which of the following best describes the skin on your body?",
    "type": "single",
    "options": [
      {
        "id": "dark_spots",
        "label": "Dark Spots"
      },
      {
        "id": "dark_patches",
        "label": "Dark Patches"
      },
      {
        "id": "not_sure",
        "label": "Not sure"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "body_pigmentation_duration",
    "concernId": "body_pigmentation",
    "label": "How long have you noticed the uneven tone?",
    "type": "single",
    "options": [
      {
        "id": "less_than_1_month",
        "label": "Less than a month"
      },
      {
        "id": "1_to_3_months",
        "label": "1–3 months"
      },
      {
        "id": "more_than_3_months",
        "label": "More than 3 months"
      },
      {
        "id": "not_sure",
        "label": "Not sure"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "underarm_goal",
    "concernId": "underarm_pigmentation",
    "label": "Describe your underarm pigmentation.",
    "type": "single",
    "options": [
      {
        "id": "mild",
        "label": "Mild — 1–2 shades darker"
      },
      {
        "id": "more_noticeable",
        "label": "More noticeable — 3 or more shades darker"
      },
      {
        "id": "not_sure",
        "label": "Not sure"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "underarm_duration",
    "concernId": "underarm_pigmentation",
    "label": "How long have you noticed it?",
    "type": "single",
    "options": [
      {
        "id": "less_than_1_month",
        "label": "Less than a month"
      },
      {
        "id": "1_to_3_months",
        "label": "1–3 months"
      },
      {
        "id": "more_than_3_months",
        "label": "More than 3 months"
      },
      {
        "id": "not_sure",
        "label": "Not sure"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "odour_timing",
    "concernId": "body_odour",
    "label": "When do you tend to smell the most?",
    "type": "single",
    "options": [
      {
        "id": "during_exercise",
        "label": "While exercising"
      },
      {
        "id": "commuting",
        "label": "While commuting or travelling"
      },
      {
        "id": "cooking",
        "label": "While cooking in the kitchen"
      },
      {
        "id": "all",
        "label": "All of the above"
      },
      {
        "id": "not_sure",
        "label": "Not sure"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "odour_location",
    "concernId": "body_odour",
    "label": "Where would you like help?",
    "type": "single",
    "options": [
      {
        "id": "underarms",
        "label": "Underarms"
      },
      {
        "id": "other",
        "label": "Other"
      },
      {
        "id": "prefer_not_to_say",
        "label": "Prefer not to say"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "sun_location",
    "concernId": "tanning_sun_damage",
    "label": "Which areas would you like help with?",
    "type": "multi",
    "options": [
      {
        "id": "face",
        "label": "Face"
      },
      {
        "id": "arms",
        "label": "Arms"
      },
      {
        "id": "legs",
        "label": "Legs"
      },
      {
        "id": "other",
        "label": "Other"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "sun_goal",
    "concernId": "tanning_sun_damage",
    "label": "Where do you have sun damage?",
    "type": "single",
    "options": [
      {
        "id": "patches",
        "label": "In patches"
      },
      {
        "id": "all_over",
        "label": "All over body"
      },
      {
        "id": "not_sure",
        "label": "Not sure"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "body_care_goal",
    "concernId": "general_body_care",
    "label": "What are you looking for?",
    "type": "multi",
    "options": [
      {
        "id": "hydration",
        "label": "Hydration"
      },
      {
        "id": "smoother_feeling_skin",
        "label": "Smoother-feeling skin"
      },
      {
        "id": "everyday_cleansing",
        "label": "Everyday cleansing"
      },
      {
        "id": "dry_feet_or_heels",
        "label": "Care for dry feet or heels"
      },
      {
        "id": "other",
        "label": "Other"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "body_care_skin_feel",
    "concernId": "general_body_care",
    "label": "What best describes the skin on your body?",
    "type": "single",
    "options": [
      {
        "id": "dry",
        "label": "Dry"
      },
      {
        "id": "normal",
        "label": "Normal"
      },
      {
        "id": "oily",
        "label": "Oily"
      },
      {
        "id": "not_sure",
        "label": "Not sure"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "face_goal",
    "concernId": "face",
    "label": "What are you experiencing on your face?",
    "type": "multi",
    "options": [
      {
        "id": "individual_spots",
        "label": "Individual pimples or spots"
      },
      {
        "id": "acne_or_bumps",
        "label": "Acne or bumps"
      },
      {
        "id": "marks_or_uneven_tone",
        "label": "Marks or uneven tone"
      },
      {
        "id": "dryness",
        "label": "Dryness"
      },
      {
        "id": "oiliness",
        "label": "Oiliness"
      },
      {
        "id": "everyday_protection",
        "label": "Everyday protection"
      },
      {
        "id": "other",
        "label": "Other"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "face_breakout_pattern",
    "concernId": "face",
    "label": "Which best describes your breakouts?",
    "type": "single",
    "options": [
      { "id": "occasional", "label": "Occasional pimples, blackheads or whiteheads" },
      { "id": "persistent_painful", "label": "Persistent, red or painful breakouts" }
    ],
    "allowSkip": true
  },
  {
    "id": "face_skin_type",
    "concernId": "face",
    "label": "How would you describe your skin?",
    "type": "single",
    "options": [
      {
        "id": "dry",
        "label": "Dry"
      },
      {
        "id": "oily",
        "label": "Oily"
      },
      {
        "id": "combination",
        "label": "Combination"
      },
      {
        "id": "normal",
        "label": "Normal"
      },
      {
        "id": "not_sure",
        "label": "Not sure"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "hair_goal",
    "concernId": "hair",
    "label": "What would you like help with?",
    "type": "multi",
    "options": [
      {
        "id": "hair_fall_shedding",
        "label": "Hair fall or shedding"
      },
      {
        "id": "visible_thinning",
        "label": "Visible thinning"
      },
      {
        "id": "hairline_concerns",
        "label": "Hairline concerns"
      },
      {
        "id": "dandruff_flakes",
        "label": "Dandruff or flakes"
      },
      {
        "id": "general_hair_care",
        "label": "General hair care"
      },
      {
        "id": "other",
        "label": "Other"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "hair_duration",
    "concernId": "hair",
    "label": "How long have you noticed the concern?",
    "type": "single",
    "options": [
      {
        "id": "less_than_1_month",
        "label": "Less than a month"
      },
      {
        "id": "1_to_3_months",
        "label": "1–3 months"
      },
      {
        "id": "more_than_3_months",
        "label": "More than 3 months"
      },
      {
        "id": "not_sure",
        "label": "Not sure"
      }
    ],
    "allowSkip": true
  },
  {
    "id": "scalp_type",
    "concernId": "hair",
    "label": "How would you describe your scalp?",
    "type": "single",
    "options": [
      {
        "id": "oily",
        "label": "Oily"
      },
      {
        "id": "dry",
        "label": "Dry"
      },
      {
        "id": "comfortable",
        "label": "Comfortable"
      },
      {
        "id": "not_sure",
        "label": "Not sure"
      }
    ],
    "allowSkip": true
  }
];

// Shared when both body acne and general body care are selected.
questions.push({ id:'shared_body_skin', concernId:'body_acne_marks', label:'How does the skin in the affected body area usually feel?', type:'single', allowSkip:true, options:[{id:'dry',label:'Dry'},{id:'comfortable',label:'Comfortable or normal'},{id:'oily',label:'Oily'}] });
questions.push({ id:'bumpy_pigmentation_same_area', concernId:'strawberry_bumpy_skin', label:'Are the bumps and pigmentation in the same area?', type:'single', allowSkip:true, options:[{id:'yes',label:'Yes'},{id:'no',label:'No'}] });
const careGoal=questions.find(q=>q.id==='body_care_goal')!;
careGoal.label='What are you experiencing?';
careGoal.options=[{id:'hydration',label:'Dry body skin'},{id:'very_dry',label:'Very dry or flaky body skin'},{id:'dry_feet_or_heels',label:'Rough or cracked heels'},{id:'stretch_marks',label:'Stretch marks'}];
