// noinspection UnnecessaryLocalVariableJS
export function generateCSSBodyForInovuaReactDataGrid(): string {
    //language=SCSS
    const scss = `
      .inovua-react-toolkit-checkbox.inovua-react-toolkit-checkbox--theme-green-dark {
        outline: none;
        color: #9ba7b4;
        font-size: 14px
      }

      .inovua-react-toolkit-checkbox.inovua-react-toolkit-checkbox--theme-green-dark.inovua-react-toolkit-checkbox--ltr .inovua-react-toolkit-checkbox__inner-content-wrapper {
        margin-left: 8px
      }

      .inovua-react-toolkit-checkbox.inovua-react-toolkit-checkbox--theme-green-dark.inovua-react-toolkit-checkbox--rtl .inovua-react-toolkit-checkbox__inner-content-wrapper {
        margin-right: 8px
      }

      .inovua-react-toolkit-checkbox.inovua-react-toolkit-checkbox--theme-green-dark.inovua-react-toolkit-checkbox--checked .inovua-react-toolkit-checkbox__icon-wrapper {
        fill: #8bb58d;
        stroke: #e8e8e8
      }

      .inovua-react-toolkit-checkbox.inovua-react-toolkit-checkbox--theme-green-dark.inovua-react-toolkit-checkbox--unchecked .inovua-react-toolkit-checkbox__icon-wrapper {
        stroke: #7c8792
      }

      .inovua-react-toolkit-checkbox.inovua-react-toolkit-checkbox--theme-green-dark.inovua-react-toolkit-checkbox--indeterminate .inovua-react-toolkit-checkbox__icon-wrapper {
        fill: #e8e8e8
      }

      .inovua-react-toolkit-checkbox.inovua-react-toolkit-checkbox--theme-green-dark.inovua-react-toolkit-checkbox--indeterminate .inovua-react-toolkit-checkbox__icon-wrapper svg {
        border-radius: 2px;
        background: #8bb58d
      }

      .inovua-react-toolkit-checkbox.inovua-react-toolkit-checkbox--theme-green-dark.inovua-react-toolkit-checkbox--browser-native {
        margin-left: 5px;
        margin-right: 5px
      }

      .inovua-react-toolkit-checkbox.inovua-react-toolkit-checkbox--theme-green-dark.inovua-react-toolkit-checkbox--disabled {
        color: rgba(155, 167, 180, .5)
      }

      .inovua-react-toolkit-checkbox.inovua-react-toolkit-checkbox--theme-green-dark.inovua-react-toolkit-checkbox--disabled.inovua-react-toolkit-checkbox--checked .inovua-react-toolkit-checkbox__icon-wrapper {
        fill: rgba(139, 181, 141, .5);
        stroke: hsla(0, 0%, 91%, .5)
      }

      .inovua-react-toolkit-checkbox.inovua-react-toolkit-checkbox--theme-green-dark.inovua-react-toolkit-checkbox--disabled.inovua-react-toolkit-checkbox--unchecked .inovua-react-toolkit-checkbox__icon-wrapper {
        stroke: rgba(124, 135, 146, .5)
      }

      .inovua-react-toolkit-checkbox.inovua-react-toolkit-checkbox--theme-green-dark.inovua-react-toolkit-checkbox--disabled.inovua-react-toolkit-checkbox--indeterminate .inovua-react-toolkit-checkbox__icon-wrapper {
        fill: hsla(0, 0%, 91%, .5)
      }

      .inovua-react-toolkit-checkbox.inovua-react-toolkit-checkbox--theme-green-dark.inovua-react-toolkit-checkbox--disabled.inovua-react-toolkit-checkbox--indeterminate .inovua-react-toolkit-checkbox__icon-wrapper svg {
        border-radius: 2px;
        background: rgba(139, 181, 141, .5)
      }

      .inovua-react-toolkit-checkbox.inovua-react-toolkit-checkbox--theme-green-dark.inovua-react-toolkit-checkbox--focused .inovua-react-toolkit-checkbox__icon-wrapper {
        box-shadow: 0 0 0 3px rgba(139, 181, 141, .5);
        border-radius: 2px
      }

      .inovua-react-toolkit-arrow-scroller.inovua-react-toolkit-arrow-scroller--theme-green-dark .inovua-react-toolkit-arrow-scroller__arrow {
        background: #313943;
        fill: #9ba7b4
      }

      .inovua-react-toolkit-arrow-scroller.inovua-react-toolkit-arrow-scroller--theme-green-dark .inovua-react-toolkit-arrow-scroller__arrow:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background: transparent
      }

      .inovua-react-toolkit-arrow-scroller.inovua-react-toolkit-arrow-scroller--theme-green-dark .inovua-react-toolkit-arrow-scroller__arrow:hover {
        fill: #e8e8e8
      }

      .inovua-react-toolkit-arrow-scroller.inovua-react-toolkit-arrow-scroller--theme-green-dark .inovua-react-toolkit-arrow-scroller__arrow:hover:before {
        background: rgba(121, 134, 203, .15)
      }

      .inovua-react-toolkit-arrow-scroller.inovua-react-toolkit-arrow-scroller--theme-green-dark .inovua-react-toolkit-arrow-scroller__arrow--direction-right {
        border-left: 1px solid #4f575f
      }

      .inovua-react-toolkit-arrow-scroller.inovua-react-toolkit-arrow-scroller--theme-green-dark .inovua-react-toolkit-arrow-scroller__arrow--direction-left {
        border-right: 1px solid #4f575f
      }

      .inovua-react-toolkit-arrow-scroller.inovua-react-toolkit-arrow-scroller--theme-green-dark .inovua-react-toolkit-arrow-scroller__arrow--direction-down {
        border-top: 1px solid #4f575f
      }

      .inovua-react-toolkit-arrow-scroller.inovua-react-toolkit-arrow-scroller--theme-green-dark .inovua-react-toolkit-arrow-scroller__arrow--direction-up {
        border-bottom: 1px solid #4f575f
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark.inovua-react-toolkit-menu--mobile .inovua-react-toolkit-arrow-scroller__arrow {
        height: 20px
      }

      .inovua-react-toolkit-date-input--theme-green-dark {
        border: 1px solid transparent;
        border-radius: 1px;
        transition: border .2s;
        background: #464d56;
        min-height: 28px
      }

      .inovua-react-toolkit-date-input--theme-green-dark:hover {
        border: 1px solid #8bb58d
      }

      .inovua-react-toolkit-date-input--theme-green-dark.inovua-react-toolkit-date-input--disabled {
        border: 1px solid transparent
      }

      .inovua-react-toolkit-date-input--theme-green-dark.inovua-react-toolkit-date-input--disabled:not(.inovua-react-toolkit-date-input__calendar-icon--disabled) {
        opacity: .5
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__input {
        padding: 0 8px;
        min-height: 28px;
        height: 28px;
        color: #9ba7b4;
        font-size: 14px
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__input::-ms-clear {
        display: none
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__input:not(.inovua-react-toolkit-date-input__input--disabled) {
        background: #464d56;
        color: #9ba7b4
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__input:not(.inovua-react-toolkit-date-input__input--disabled)::-ms-clear {
        display: none
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__input:-ms-input-placeholder {
        color: rgba(155, 167, 180, .5)
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__input::placeholder {
        color: rgba(155, 167, 180, .5)
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__input-placeholder {
        color: rgba(155, 167, 180, .5)
      }

      .inovua-react-toolkit-date-input--theme-green-dark.inovua-react-toolkit-date-input--focused {
        border: 1px solid #8bb58d;
        box-shadow: 0 0 0 2px rgba(139, 181, 141, .4)
      }

      .inovua-react-toolkit-date-input--theme-green-dark > .inovua-react-toolkit-date-input__picker {
        box-shadow: 0 2px 12px rgba(0, 0, 0, .34375)
      }

      .inovua-react-toolkit-date-input--theme-green-dark.inovua-react-toolkit-date-input--rtl .inovua-react-toolkit-date-input__calendar-icon {
        margin-left: 8px
      }

      .inovua-react-toolkit-date-input--theme-green-dark.inovua-react-toolkit-date-input--ltr .inovua-react-toolkit-date-input__calendar-icon {
        margin-right: 8px
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__calendar-icon {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        fill: #9ba7b4
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__calendar-icon:hover:not(.inovua-react-toolkit-date-input__calendar-icon--disabled) {
        fill: #e8e8e8
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__calendar-icon:active:not(.inovua-react-toolkit-date-input__calendar-icon--disabled) {
        margin-top: 1px
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__clear-icon {
        color: #9ba7b4;
        fill: #9ba7b4;
        margin-right: 8px;
        flex: 1 0 auto;
        transform: translateY(0)
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__clear-icon:active {
        transform: translateY(1px)
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__clear-icon--disabled {
        display: flex
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__clear-icon--animation {
        animation: inovua-react-toolkit-date-input-animation-fade-in .2s
      }

      @keyframes inovua-react-toolkit-date-input-animation-fade-in {
        0% {
          opacity: 0
        }
        to {
          opacity: 1
        }
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__clear-icon--hidden {
        visibility: hidden;
        margin-right: 4px
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__clear-icon {
        transition: fill .25s ease-in-out
      }

      .inovua-react-toolkit-date-input--theme-green-dark .inovua-react-toolkit-date-input__clear-icon:hover {
        color: #e8e8e8;
        fill: #e8e8e8
      }

      .inovua-react-toolkit-date-input--theme-green-dark.inovua-react-toolkit-date-input--focused .inovua-react-toolkit-date-input__clear-icon {
        color: #9ba7b4;
        fill: #9ba7b4
      }

      .inovua-react-toolkit-calendar__clock--theme-green-dark .inovua-react-toolkit-calendar__clock-center {
        background: #e8f2ff
      }

      .inovua-react-toolkit-calendar__clock--theme-green-dark .inovua-react-toolkit-calendar__clock-overlay {
        background: #fff;
        border-style: solid;
        border-color: #9ba7b4
      }

      .inovua-react-toolkit-calendar__clock--theme-green-dark .inovua-react-toolkit-calendar__clock-hand, .inovua-react-toolkit-calendar__clock--theme-green-dark .inovua-react-toolkit-calendar__clock-tick {
        background: #9ba7b4
      }

      .inovua-react-toolkit-calendar__clock--theme-green-dark .inovua-react-toolkit-calendar__clock-hand-second {
        background: red
      }

      .inovua-react-toolkit-calendar__footer--theme-green-dark {
        padding: 4px 12px 6px;
        display: flex;
        flex: 1
      }

      .inovua-react-toolkit-calendar__footer--theme-green-dark .inovua-react-toolkit-calendar__footer-button {
        min-width: 70px
      }

      .inovua-react-toolkit-calendar__footer--theme-green-dark .inovua-react-toolkit-calendar__footer-button.inovua-react-toolkit-calendar__footer-button-cancel.inovua-react-toolkit-calendar__footer-button-cancel.inovua-react-toolkit-calendar__footer-button-cancel {
        border: 1px solid #7a838e;
        color: #9ba7b4;
        max-height: 28px;
        border-radius: 1px
      }

      .inovua-react-toolkit-calendar__footer--theme-green-dark .inovua-react-toolkit-calendar__footer-button.inovua-react-toolkit-calendar__footer-button-today.inovua-react-toolkit-calendar__footer-button-today.inovua-react-toolkit-calendar__footer-button-today {
        max-height: 28px;
        border-radius: 1px
      }

      .inovua-react-toolkit-calendar__footer--theme-green-dark .inovua-react-toolkit-calendar__footer-button.inovua-react-toolkit-calendar__footer-button-today.inovua-react-toolkit-calendar__footer-button-today.inovua-react-toolkit-calendar__footer-button-today:hover {
        color: #9ba7b4
      }

      .inovua-react-toolkit-calendar__footer--theme-green-dark .inovua-react-toolkit-calendar__footer-button + .inovua-react-toolkit-calendar__footer-button {
        margin-left: 16px
      }

      .inovua-react-toolkit-calendar__date-format-spinner--theme-green-dark {
        border: 1px solid grey
      }

      .inovua-react-toolkit-calendar__date-format-spinner--theme-green-dark input {
        padding: 5px;
        border: none;
        outline: none
      }

      .inovua-react-toolkit-calendar__date-format-spinner--theme-green-dark:not([disabled]).inovua-react-toolkit-calendar__date-format-spinner--focused {
        border: 1px solid #313943
      }

      .inovua-react-toolkit-calendar__date-format-spinner--theme-green-dark:not([disabled]) .inovua-react-toolkit-calendar__date-format-spinner-arrow {
        transform: translateY(0);
        cursor: pointer
      }

      .inovua-react-toolkit-calendar__date-format-spinner--theme-green-dark:not([disabled]) .inovua-react-toolkit-calendar__date-format-spinner-arrow:active {
        fill: #313943;
        transform: translateY(1px)
      }

      .inovua-react-toolkit-calendar__year-view--theme-green-dark {
        padding: 2px;
        display: flex;
        align-items: center
      }

      .inovua-react-toolkit-calendar__year-view--theme-green-dark .inovua-react-toolkit-calendar__year-view-row {
        min-height: 36px;
        min-width: 144px
      }

      .inovua-react-toolkit-calendar__year-view--theme-green-dark .inovua-react-toolkit-calendar__year-view-month {
        padding: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 24px;
        max-height: 24px;
        min-width: 40px;
        max-width: 40px;
        height: 24px;
        border-radius: 1px;
        margin: 1px
      }

      .inovua-react-toolkit-calendar__year-view--theme-green-dark .inovua-react-toolkit-calendar__year-view-month:hover {
        background: rgba(139, 181, 141, .15);
        color: #c5cae9
      }

      .inovua-react-toolkit-calendar__year-view--theme-green-dark .inovua-react-toolkit-calendar__year-view-month--disabled {
        color: rgba(155, 167, 180, .5)
      }

      .inovua-react-toolkit-calendar__year-view--theme-green-dark .inovua-react-toolkit-calendar__year-view-month--value {
        color: #c5cae9;
        background: rgba(139, 181, 141, .25) padding-box
      }

      .inovua-react-toolkit-calendar__year-view--theme-green-dark .inovua-react-toolkit-calendar__year-view-month--active.inovua-react-toolkit-calendar__date-format-spinner__year-view-month--value {
        background: #3c4652 padding-box
      }

      .inovua-react-toolkit-calendar__decade-view--theme-green-dark {
        padding: 2px 0;
        min-height: 92px;
        min-width: 238px
      }

      .inovua-react-toolkit-calendar__decade-view--theme-green-dark .inovua-react-toolkit-calendar__decade-view-row {
        min-width: 190px;
        min-height: 46px;
        justify-content: center
      }

      .inovua-react-toolkit-calendar__decade-view--theme-green-dark .inovua-react-toolkit-calendar__decade-view-arrow {
        cursor: pointer;
        position: relative;
        fill: #9ba7b4;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 1px;
        transition: background .3s, fill .3s
      }

      .inovua-react-toolkit-calendar__decade-view--theme-green-dark .inovua-react-toolkit-calendar__decade-view-arrow:hover {
        fill: #e8e8e8;
        background: rgba(139, 181, 141, .15)
      }

      .inovua-react-toolkit-calendar__decade-view--theme-green-dark .inovua-react-toolkit-calendar__decade-view-arrow--disabled {
        fill: rgba(82, 82, 82, .5)
      }

      .inovua-react-toolkit-calendar__decade-view--theme-green-dark .inovua-react-toolkit-calendar__decade-view-arrow--prev:not(.inovua-react-toolkit-calendar__decade-view-arrow--disabled):active {
        right: 1px
      }

      .inovua-react-toolkit-calendar__decade-view--theme-green-dark .inovua-react-toolkit-calendar__decade-view-arrow--next:not(.inovua-react-toolkit-calendar__decade-view-arrow--disabled):active {
        left: 1px
      }

      .inovua-react-toolkit-calendar__decade-view--theme-green-dark .inovua-react-toolkit-calendar__decade-view-year {
        margin: 5px 1px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 24px;
        max-height: 24px;
        min-width: 44px;
        max-width: 44px;
        height: 24px;
        border-radius: 1px
      }

      .inovua-react-toolkit-calendar__decade-view--theme-green-dark .inovua-react-toolkit-calendar__decade-view-year:hover {
        background: rgba(139, 181, 141, .15);
        color: #c5cae9
      }

      .inovua-react-toolkit-calendar__decade-view--theme-green-dark .inovua-react-toolkit-calendar__decade-view-year--disabled {
        color: rgba(155, 167, 180, .5)
      }

      .inovua-react-toolkit-calendar__decade-view--theme-green-dark .inovua-react-toolkit-calendar__decade-view-year--value {
        color: #c5cae9;
        background: rgba(139, 181, 141, .25) padding-box
      }

      .inovua-react-toolkit-calendar__month-decade-view--theme-green-dark {
        padding: 2px;
        background: #313943
      }

      .inovua-react-toolkit-calendar__month-decade-view--theme-green-dark .inovua-react-toolkit-calendar__month-decade-view__separator {
        width: 100%;
        height: 1px;
        background: #4f575f;
        margin: 5px auto
      }

      .inovua-react-toolkit-calendar__month-decade-view--theme-green-dark .inovua-react-toolkit-calendar__decade-view--theme-green-dark, .inovua-react-toolkit-calendar__month-decade-view--theme-green-dark .inovua-react-toolkit-calendar__year-view--theme-green-dark {
        border: none;
        min-height: 110px;
        display: flex;
        align-items: center;
        width: 100%
      }

      .inovua-react-toolkit-calendar__nav-bar .inovua-react-toolkit-calendar__month-decade-view--theme-green-dark {
        font-size: 14px;
        color: #9ba7b4
      }

      .inovua-react-toolkit-calendar__nav-bar--theme-green-dark {
        padding: 0 2px;
        font-size: 14px;
        background: #313943;
        color: #9ba7b4;
        border-radius: 1px;
        fill: #9ba7b4
      }

      .inovua-react-toolkit-calendar__nav-bar--theme-green-dark.inovua-react-toolkit-calendar__nav-bar-month-decade-view-modal {
        background: rgba(139, 181, 141, .5)
      }

      .inovua-react-toolkit-calendar__nav-bar--theme-green-dark .inovua-react-toolkit-calendar__nav-bar-arrows-pos {
        min-height: 32px;
        min-width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background .2s;
        border-radius: 1px
      }

      .inovua-react-toolkit-calendar__nav-bar--theme-green-dark .inovua-react-toolkit-calendar__nav-bar-arrows-pos:hover {
        fill: #e8e8e8;
        background: rgba(139, 181, 141, .15)
      }

      .inovua-react-toolkit-calendar__nav-bar--theme-green-dark .inovua-react-toolkit-calendar__nav-bar-date {
        min-height: 32px;
        height: 32px;
        padding: 2px 0;
        display: flex;
        align-items: center;
        justify-content: center
      }

      .inovua-react-toolkit-calendar__nav-bar--theme-green-dark .inovua-react-toolkit-calendar__nav-bar-arrows-div {
        display: inline-flex
      }

      .inovua-react-toolkit-calendar__nav-bar--theme-green-dark .inovua-react-toolkit-calendar__nav-bar-month-decade-view {
        background: #313943;
        display: flex;
        align-items: center
      }

      .inovua-react-toolkit-calendar__nav-bar--theme-green-dark.inovua-react-toolkit-calendar__nav-bar--with-month-decade-view .inovua-react-toolkit-calendar__nav-bar-date {
        cursor: pointer
      }

      .inovua-react-toolkit-calendar__nav-bar--theme-green-dark.inovua-react-toolkit-calendar__nav-bar--with-month-decade-view .inovua-react-toolkit-calendar__nav-bar-date-disabled {
        cursor: auto
      }

      .inovua-react-toolkit-calendar__nav-bar--theme-green-dark .inovua-react-toolkit-calendar__nav-bar-arrow {
        fill: #9ba7b4;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px 0;
        transform: translateY(0)
      }

      .inovua-react-toolkit-calendar__nav-bar--theme-green-dark .inovua-react-toolkit-calendar__nav-bar-arrow--disabled {
        fill: rgba(82, 82, 82, .5)
      }

      .inovua-react-toolkit-calendar__nav-bar--theme-green-dark .inovua-react-toolkit-calendar__nav-bar-arrow:not(.inovua-react-toolkit-calendar__nav-bar-arrows-pos--disabled):active {
        transform: translateY(1px)
      }

      .inovua-react-toolkit-calendar__calendar--theme-green-dark.inovua-react-toolkit-date-input__picker {
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, .4)
      }

      .inovua-react-toolkit-calendar__calendar--theme-green-dark .inovua-react-toolkit-calendar__calendar--theme-green-dark {
        border: none
      }

      .inovua-react-toolkit-calendar__calendar--theme-green-dark .inovua-react-toolkit-calendar__clock {
        margin: 8px 14px 32px 8px
      }

      .inovua-react-toolkit-calendar__calendar--theme-green-dark .inovua-react-toolkit-calendar__clock-input {
        margin-left: 4px
      }

      .inovua-react-toolkit-calendar__calendar--theme-green-dark .inovua-react-toolkit-calendar__clock-input-spinner {
        border: 1px solid #464d56;
        margin-right: 14px;
        border-radius: 1px;
        background: #464d56;
        cursor: pointer
      }

      .inovua-react-toolkit-calendar__calendar--theme-green-dark .inovua-react-toolkit-calendar__clock-input-spinner:hover {
        margin-right: 14px
      }

      .inovua-react-toolkit-calendar__calendar--theme-green-dark .inovua-react-toolkit-calendar__clock-input-spinner--focused {
        border: 1px solid #8bb58d;
        background: #464d56;
        box-shadow: 0 0 0 2px rgba(139, 181, 141, .4);
        margin-right: 14px;
        border-radius: 1px
      }

      .inovua-react-toolkit-calendar__calendar--theme-green-dark .inovua-react-toolkit-calendar__clock-input-spinner-arrow-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        cursor: pointer
      }

      .inovua-react-toolkit-calendar__calendar--theme-green-dark .inovua-react-toolkit-calendar__clock-input-spinner-arrow-wrapper .inovua-react-toolkit-calendar__clock-input-spinner-arrow {
        fill: #9ba7b4;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 15px;
        width: 24px;
        position: relative
      }

      .inovua-react-toolkit-calendar__calendar--theme-green-dark .inovua-react-toolkit-calendar__clock-input-spinner-arrow-wrapper .inovua-react-toolkit-calendar__clock-input-spinner-arrow:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 15px;
        width: 24px
      }

      .inovua-react-toolkit-calendar__calendar--theme-green-dark .inovua-react-toolkit-calendar__clock-input-spinner-arrow-wrapper .inovua-react-toolkit-calendar__clock-input-spinner-arrow--disabled {
        fill: #515964
      }

      .inovua-react-toolkit-calendar__calendar--theme-green-dark .inovua-react-toolkit-calendar__clock-input-spinner-arrow-wrapper .inovua-react-toolkit-calendar__clock-input-spinner-arrow:hover {
        fill: #e8e8e8
      }

      .inovua-react-toolkit-calendar__calendar--theme-green-dark .inovua-react-toolkit-calendar__clock-input-spinner-arrow-wrapper .inovua-react-toolkit-calendar__clock-input-spinner-arrow:hover:before {
        background: rgba(139, 181, 141, .15)
      }

      .inovua-react-toolkit-calendar__calendar--theme-green-dark .inovua-react-toolkit-calendar__clock-input-spinner-arrow-wrapper .inovua-react-toolkit-calendar__clock-input-spinner-arrow:active {
        fill: #e8e8e8
      }

      .inovua-react-toolkit-calendar__calendar--theme-green-dark .inovua-react-toolkit-calendar__clock-input-spinner-arrow-wrapper .inovua-react-toolkit-calendar__clock-input-spinner-arrow:active:before {
        background: rgba(139, 181, 141, .25)
      }

      .inovua-react-toolkit-calendar__input--theme-green-dark {
        border: none;
        outline: none;
        padding-left: 8px;
        min-height: 28px;
        color: #9ba7b4;
        font-size: 14px;
        background: #464d56
      }

      .inovua-react-toolkit-calendar__input--theme-green-dark.inovua-react-toolkit-calendar__input--disabled {
        background: #373e48;
        color: #5e666f
      }

      .inovua-react-toolkit-calendar__calendar--theme-green-dark, .inovua-react-toolkit-calendar__date-input--theme-green-dark, .inovua-react-toolkit-calendar__month-view--theme-green-dark, .inovua-react-toolkit-calendar__transition-month-view--theme-green-dark {
        font-size: 14px
      }

      .inovua-react-toolkit-calendar__transition-month-view--theme-green-dark {
        border: 1px solid transparent
      }

      .inovua-react-toolkit-calendar__transition-month-view--theme-green-dark .inovua-react-toolkit-calendar__calendar--theme-green-dark, .inovua-react-toolkit-calendar__transition-month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view--theme-green-dark, .inovua-react-toolkit-calendar__transition-month-view--theme-green-dark .inovua-react-toolkit-calendar__multi-month-view--theme-green-dark {
        border: none
      }

      .inovua-react-toolkit-calendar__navigation-view--theme-green-dark {
        border: 1px solid transparent
      }

      .inovua-react-toolkit-calendar__navigation-view--theme-green-dark .inovua-react-toolkit-calendar__month-view, .inovua-react-toolkit-calendar__navigation-view--theme-green-dark .inovua-react-toolkit-calendar__multi-month-view {
        border: none
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark {
        background: #313943;
        border: 1px solid transparent;
        border-radius: 1px
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark.inovua-react-toolkit-calendar__month-view-relative {
        position: relative
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-row {
        padding: 0 4px
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-row.inovua-react-toolkit-calendar__month-view-row:last-child {
        margin-bottom: 4px
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-week-day-names {
        color: #737f8b;
        font-size: 14px
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-week-number {
        color: #5b6570;
        font-size: 12px
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-week-number.inovua-react-toolkit-calendar__month-view-cell {
        flex: none
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-cell {
        min-width: 32px;
        min-height: 32px;
        margin: 1px
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day {
        z-index: 10;
        color: #9ba7b4;
        border-radius: 1px;
        border: 2px solid transparent;
        position: relative
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day .inovua-react-toolkit-calendar__month-view-day-text {
        cursor: pointer;
        text-align: center;
        outline: none;
        width: 100%;
        height: 100%;
        min-width: 32px;
        min-height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 1px
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day:not(.inovua-react-toolkit-calendar__month-view-day--today-highlight):hover {
        background: rgba(139, 181, 141, .15)
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-hover-range, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-range {
        overflow: hidden
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-hover-range .inovua-react-toolkit-calendar__month-view-day-text, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-range .inovua-react-toolkit-calendar__month-view-day-text {
        position: relative
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-hover-range .inovua-react-toolkit-calendar__month-view-day-text:after, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-hover-range .inovua-react-toolkit-calendar__month-view-day-text:before, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-range .inovua-react-toolkit-calendar__month-view-day-text:after, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-range .inovua-react-toolkit-calendar__month-view-day-text:before {
        position: absolute;
        height: 100%;
        top: 0;
        bottom: 0;
        width: 500%;
        z-index: -1;
        content: ""
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-hover-range .inovua-react-toolkit-calendar__month-view-day-text:before, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-range .inovua-react-toolkit-calendar__month-view-day-text:before {
        right: 50%
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-hover-range .inovua-react-toolkit-calendar__month-view-day-text:after, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-range .inovua-react-toolkit-calendar__month-view-day-text:after {
        left: 50%
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-hover-range.inovua-react-toolkit-calendar__month-view-day--hover-range-end .inovua-react-toolkit-calendar__month-view-day-text:after, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-hover-range.inovua-react-toolkit-calendar__month-view-day--hover-range-start .inovua-react-toolkit-calendar__month-view-day-text:before, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-hover-range.inovua-react-toolkit-calendar__month-view-day--range-end:not(.inovua-react-toolkit-calendar__month-view-day--in-hover-range) .inovua-react-toolkit-calendar__month-view-day-text:after, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-hover-range.inovua-react-toolkit-calendar__month-view-day--range-start:not(.inovua-react-toolkit-calendar__month-view-day--in-hover-range) .inovua-react-toolkit-calendar__month-view-day-text:before, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-range.inovua-react-toolkit-calendar__month-view-day--hover-range-end .inovua-react-toolkit-calendar__month-view-day-text:after, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-range.inovua-react-toolkit-calendar__month-view-day--hover-range-start .inovua-react-toolkit-calendar__month-view-day-text:before, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-range.inovua-react-toolkit-calendar__month-view-day--range-end:not(.inovua-react-toolkit-calendar__month-view-day--in-hover-range) .inovua-react-toolkit-calendar__month-view-day-text:after, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-range.inovua-react-toolkit-calendar__month-view-day--range-start:not(.inovua-react-toolkit-calendar__month-view-day--in-hover-range) .inovua-react-toolkit-calendar__month-view-day-text:before {
        display: none
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-hover-range.inovua-react-toolkit-calendar__month-view-day--hover-range-end:not(.inovua-react-toolkit-calendar__month-view-day--hover-range-start) .inovua-react-toolkit-calendar__month-view-day-text:before, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-hover-range.inovua-react-toolkit-calendar__month-view-day--hover-range-start:not(.inovua-react-toolkit-calendar__month-view-day--hover-range-end) .inovua-react-toolkit-calendar__month-view-day-text:after, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-range.inovua-react-toolkit-calendar__month-view-day--hover-range-end:not(.inovua-react-toolkit-calendar__month-view-day--hover-range-start) .inovua-react-toolkit-calendar__month-view-day-text:before, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-range.inovua-react-toolkit-calendar__month-view-day--hover-range-start:not(.inovua-react-toolkit-calendar__month-view-day--hover-range-end) .inovua-react-toolkit-calendar__month-view-day-text:after {
        display: inherit
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-range {
        background: rgba(139, 181, 141, .25);
        color: #c5cae9;
        border-radius: 0
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-range.inovua-react-toolkit-calendar__month-view-day--active {
        background: rgba(139, 181, 141, .25)
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--in-range:hover {
        background: rgba(139, 181, 141, .15);
        border: 2px solid transparent
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--range-start {
        border-radius: 1px 0 0 1px
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--range-end {
        border-radius: 0 1px 1px 0
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--today-highlight {
        background: #8bb58d;
        color: #c5cae9
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--today-highlight:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--today-highlight:hover {
        border: 2px solid rgba(0, 0, 0, .15)
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--today-highlight:hover:before {
        background: rgba(0, 0, 0, .15)
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--today-highlight.inovua-react-toolkit-calendar__month-view-day--active {
        color: #c5cae9
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--today-highlight.inovua-react-toolkit-calendar__month-view-day--active .inovua-react-toolkit-calendar__month-view-day-text {
        background: #8bb58d;
        border: 2px solid #313943
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--active {
        background: #313943;
        border: 2px solid #8bb58d;
        color: #c5cae9
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--active:hover {
        border: 2px solid #8bb58d
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--next-month, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--prev-month {
        color: #5b6570;
        font-size: 14px
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--weekend-highlight, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--weekend-highlight:hover {
        color: #ef9a9a
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--weekend-highlight.inovua-react-toolkit-calendar__month-view-day--next-month, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--weekend-highlight.inovua-react-toolkit-calendar__month-view-day--prev-month {
        color: rgba(239, 154, 154, .6)
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--disabled {
        color: rgba(155, 167, 180, .5)
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--disabled .inovua-react-toolkit-calendar__month-view-day-text {
        cursor: default
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--disabled .inovua-react-toolkit-calendar__month-view-day-text:hover {
        background: none;
        color: rgba(155, 167, 180, .5)
      }

      .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--disabled.inovua-react-toolkit-calendar__month-view-day--next-month, .inovua-react-toolkit-calendar__month-view--theme-green-dark .inovua-react-toolkit-calendar__month-view-day--disabled.inovua-react-toolkit-calendar__month-view-day--prev-month {
        color: rgba(155, 167, 180, .5)
      }

      .inovua-react-toolkit-calendar__multi-month-view {
        border: 1px solid transparent;
        position: relative
      }

      .inovua-react-toolkit-calendar__multi-month-view .inovua-react-toolkit-calendar__month-view {
        border: none
      }

      .inovua-react-toolkit-text-input.inovua-react-toolkit-text-input--theme-green-dark {
        font-size: 14px;
        fill: #9ba7b4;
        border: 1px solid #464d56;
        border-radius: 1px;
        background: #464d56;
        color: #9ba7b4;
        min-height: 32px;
        height: 32px;
        transition: all .2s
      }

      .inovua-react-toolkit-text-input.inovua-react-toolkit-text-input--theme-green-dark input.inovua-react-toolkit-text-input__input {
        font-size: inherit;
        color: inherit
      }

      .inovua-react-toolkit-text-input.inovua-react-toolkit-text-input--theme-green-dark input.inovua-react-toolkit-text-input__input:-ms-input-placeholder {
        color: rgba(155, 167, 180, .5)
      }

      .inovua-react-toolkit-text-input.inovua-react-toolkit-text-input--theme-green-dark input.inovua-react-toolkit-text-input__input::placeholder {
        color: rgba(155, 167, 180, .5)
      }

      .inovua-react-toolkit-text-input.inovua-react-toolkit-text-input--theme-green-dark:hover {
        border: 1px solid #8bb58d
      }

      .inovua-react-toolkit-text-input.inovua-react-toolkit-text-input--theme-green-dark.inovua-react-toolkit-text-input--disabled {
        fill: rgba(155, 167, 180, .7);
        opacity: .5
      }

      .inovua-react-toolkit-text-input.inovua-react-toolkit-text-input--theme-green-dark.inovua-react-toolkit-text-input--disabled:hover {
        border: 1px solid #464d56
      }

      .inovua-react-toolkit-text-input.inovua-react-toolkit-text-input--theme-green-dark.inovua-react-toolkit-text-input--focused {
        border: 1px solid #8bb58d;
        box-shadow: 0 0 0 2px rgba(139, 181, 141, .4)
      }

      .inovua-react-toolkit-text-input.inovua-react-toolkit-text-input--theme-green-dark .inovua-react-toolkit-text-input__spinner-wrapper {
        margin: 4px 6px 4px 0
      }

      .inovua-react-toolkit-text-input.inovua-react-toolkit-text-input--theme-green-dark .inovua-react-toolkit-text-input__clear-button {
        stroke: #9ba7b4;
        transition: stroke .25s ease-in-out
      }

      .inovua-react-toolkit-text-input.inovua-react-toolkit-text-input--theme-green-dark .inovua-react-toolkit-text-input__clear-button:hover {
        stroke: #e8e8e8
      }

      .inovua-react-toolkit-radio-button.inovua-react-toolkit-radio-button--theme-green-dark {
        outline: none;
        color: #9ba7b4;
        font-size: 14px
      }

      .inovua-react-toolkit-radio-button.inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--ltr .inovua-react-toolkit-radio-button__inner-content-wrapper {
        margin-left: 8px
      }

      .inovua-react-toolkit-radio-button.inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--rtl .inovua-react-toolkit-radio-button__inner-content-wrapper {
        margin-right: 8px
      }

      .inovua-react-toolkit-radio-button.inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--checked .inovua-react-toolkit-radio-button__icon-wrapper {
        fill: #8bb58d;
        stroke: #e8e8e8
      }

      .inovua-react-toolkit-radio-button.inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--unchecked .inovua-react-toolkit-radio-button__icon-wrapper {
        stroke: #7c8792
      }

      .inovua-react-toolkit-radio-button.inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--indeterminate .inovua-react-toolkit-radio-button__icon-wrapper {
        fill: #e8e8e8
      }

      .inovua-react-toolkit-radio-button.inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--indeterminate .inovua-react-toolkit-radio-button__icon-wrapper svg {
        border-radius: 2px;
        background: #8bb58d
      }

      .inovua-react-toolkit-radio-button.inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--browser-native {
        margin-left: 5px;
        margin-right: 5px
      }

      .inovua-react-toolkit-radio-button.inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--disabled {
        color: rgba(155, 167, 180, .5)
      }

      .inovua-react-toolkit-radio-button.inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--disabled.inovua-react-toolkit-radio-button--checked .inovua-react-toolkit-radio-button__icon-wrapper {
        fill: rgba(139, 181, 141, .5);
        stroke: hsla(0, 0%, 91%, .5)
      }

      .inovua-react-toolkit-radio-button.inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--disabled.inovua-react-toolkit-radio-button--unchecked .inovua-react-toolkit-radio-button__icon-wrapper {
        stroke: rgba(124, 135, 146, .5)
      }

      .inovua-react-toolkit-radio-button.inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--disabled.inovua-react-toolkit-radio-button--indeterminate .inovua-react-toolkit-radio-button__icon-wrapper {
        fill: hsla(0, 0%, 91%, .5)
      }

      .inovua-react-toolkit-radio-button.inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--disabled.inovua-react-toolkit-radio-button--indeterminate .inovua-react-toolkit-radio-button__icon-wrapper svg {
        border-radius: 2px;
        background: rgba(139, 181, 141, .5)
      }

      .inovua-react-toolkit-radio-button.inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--focused .inovua-react-toolkit-radio-button__icon-wrapper {
        box-shadow: 0 0 0 3px rgba(139, 181, 141, .5);
        border-radius: 2px
      }

      .inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button .inovua-react-toolkit-radio-button__inner-content-wrapper {
        color: #9ba7b4
      }

      .inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--checked svg {
        fill: #8bb58d;
        stroke: #8bb58d
      }

      .inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--checked .inovua-react-toolkit-radio-button__inner-content-wrapper {
        color: #c5cae9
      }

      .inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--unchecked {
        stroke: #737f8b
      }

      .inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--disabled {
        fill: #4e565e;
        stroke: #4e565e
      }

      .inovua-react-toolkit-radio-button--theme-green-dark.inovua-react-toolkit-radio-button--disabled .inovua-react-toolkit-radio-button__inner-content-wrapper {
        color: #5e666f
      }

      .inovua-react-toolkit-radio-button-group.inovua-react-toolkit-radio-button-group--theme-green-dark {
        outline: none
      }

      .inovua-react-toolkit-radio-button-group.inovua-react-toolkit-radio-button-group--theme-green-dark.inovua-react-toolkit-radio-button-group--focused .inovua-react-toolkit-radio-button--checked .inovua-react-toolkit-radio-button__icon-wrapper {
        border-radius: 10px;
        box-shadow: 0 0 0 3px rgba(139, 181, 141, .3)
      }

      .inovua-react-toolkit-radio-button-group.inovua-react-toolkit-radio-button-group--theme-green-dark.inovua-react-toolkit-radio-button-group--orientation-vertical .inovua-react-toolkit-radio-button {
        margin-bottom: 8px
      }

      .inovua-react-toolkit-radio-button-group.inovua-react-toolkit-radio-button-group--theme-green-dark.inovua-react-toolkit-radio-button-group--orientation-horizontal {
        display: flex
      }

      .inovua-react-toolkit-radio-button-group.inovua-react-toolkit-radio-button-group--theme-green-dark.inovua-react-toolkit-radio-button-group--orientation-horizontal.inovua-react-toolkit-radio-button-group--rtl > :not(:first-child) {
        margin-right: 8px
      }

      .inovua-react-toolkit-radio-button-group.inovua-react-toolkit-radio-button-group--theme-green-dark.inovua-react-toolkit-radio-button-group--orientation-horizontal.inovua-react-toolkit-radio-button-group--ltr > :not(:first-child) {
        margin-left: 8px
      }

      .inovua-react-scroll-container--theme-green-dark .inovua-react-scroll-container__track--visible {
        background-color: rgba(115, 127, 139, .3)
      }

      .inovua-react-scroll-container--theme-green-dark .inovua-react-scroll-container__thumb {
        background-color: #737f8b
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-toolbar__arrow {
        fill: #9ba7b4
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-toolbar__arrow:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background: transparent
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-toolbar__arrow:hover {
        fill: #e8e8e8
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-toolbar__arrow:hover:before {
        background: rgba(121, 134, 203, .15)
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark {
        font-size: 14px;
        background-color: #313943;
        border: none;
        color: #9ba7b4;
        fill: #9ba7b4
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark.inovua-react-toolkit-menu--rtl, .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark.inovua-react-toolkit-menu--shadow {
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, .4)
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark.inovua-react-toolkit-menu--depth-1, .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark.inovua-react-toolkit-menu--depth-2, .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark.inovua-react-toolkit-menu--depth-3 {
        background-color: #313943
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__table {
        padding: 8px 0
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row .inovua-react-toolkit-menu__cell--has-expander .inovua-react-toolkit-menu__expander-wrapper {
        display: flex;
        justify-content: flex-end
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row .inovua-react-toolkit-menu__cell--has-expander .inovua-react-toolkit-menu__expander-wrapper .inovua-react-toolkit-menu__expander-icon {
        border-radius: 1px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-right: 14px
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--focused.inovua-react-toolkit-menu__row--over {
        position: relative
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell--radio .inovua-react-toolkit-radio-button--ltr.inovua-react-toolkit-radio-button--children-position-end .inovua-react-toolkit-radio-button__icon-wrapper, .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell--radio .inovua-react-toolkit-radio-button--rtl.inovua-react-toolkit-radio-button--children-position-start .inovua-react-toolkit-radio-button__icon-wrapper {
        margin-right: 0
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell--radio .inovua-react-toolkit-radio-button--ltr.inovua-react-toolkit-radio-button--children-position-start .inovua-react-toolkit-radio-button__icon-wrapper, .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell--radio .inovua-react-toolkit-radio-button--rtl.inovua-react-toolkit-radio-button--children-position-end .inovua-react-toolkit-radio-button__icon-wrapper {
        margin-left: 0
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--focused {
        position: relative
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--focused.inovua-react-toolkit-menu__row--checked .inovua-react-toolkit-menu__cell--radio .inovua-react-toolkit-radio-button__icon-wrapper {
        border-radius: 10px;
        box-shadow: 0 0 0 3px rgba(139, 181, 141, .3)
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--focused .inovua-react-toolkit-menu__cell {
        position: relative
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--focused .inovua-react-toolkit-menu__cell:before {
        position: absolute;
        content: " ";
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-top: 2px solid #8bb58d;
        border-bottom: 2px solid #8bb58d
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--focused .inovua-react-toolkit-menu__cell:first-child:before {
        left: 0;
        border-left: 2px solid #8bb58d
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--focused .inovua-react-toolkit-menu__cell:last-child:before {
        right: 0;
        border-right: 2px solid #8bb58d
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark.inovua-react-toolkit-menu--rtl .inovua-react-toolkit-menu__row--focused.inovua-react-toolkit-menu__row--over .inovua-react-toolkit-menu__cell:before {
        position: absolute;
        content: " ";
        top: 1px;
        bottom: 1px;
        left: 0;
        right: 0;
        border-top: 2px solid #8bb58d;
        border-bottom: 2px solid #8bb58d
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark.inovua-react-toolkit-menu--rtl .inovua-react-toolkit-menu__row--focused.inovua-react-toolkit-menu__row--over .inovua-react-toolkit-menu__cell:first-child:before {
        right: 1px;
        border-right: 2px solid #8bb58d
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark.inovua-react-toolkit-menu--rtl .inovua-react-toolkit-menu__row--focused.inovua-react-toolkit-menu__row--over .inovua-react-toolkit-menu__cell:last-child:before {
        left: 1px;
        border-left: 2px solid #8bb58d
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark.inovua-react-toolkit-menu--rtl .inovua-react-toolkit-menu__row--focused .inovua-react-toolkit-menu__cell:before {
        right: -1px;
        left: -1px;
        border-top: 2px solid #8bb58d;
        border-bottom: 2px solid #8bb58d
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark.inovua-react-toolkit-menu--rtl .inovua-react-toolkit-menu__row--focused .inovua-react-toolkit-menu__cell:first-child:before, .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark.inovua-react-toolkit-menu--rtl .inovua-react-toolkit-menu__row--focused .inovua-react-toolkit-menu__cell:last-child:before {
        right: 0;
        left: 0
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark.inovua-react-toolkit-menu--rtl .inovua-react-toolkit-menu__row--focused .inovua-react-toolkit-menu__cell:first-child:before {
        border-left: 0;
        border-right: 2px solid #8bb58d
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark.inovua-react-toolkit-menu--rtl .inovua-react-toolkit-menu__row--focused .inovua-react-toolkit-menu__cell:last-child:before {
        border-right: 0;
        border-left: 2px solid #8bb58d
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--over {
        color: #c5cae9;
        fill: #c5cae9;
        background-color: rgba(139, 181, 141, .15)
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--over .inovua-react-toolkit-menu__cell {
        background-color: rgba(139, 181, 141, .15)
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--over .inovua-react-toolkit-menu__cell--has-expander .inovua-react-toolkit-menu__expander {
        fill: #e8e8e8
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--active {
        color: #c5cae9;
        fill: #c5cae9;
        background-color: rgba(139, 181, 141, .25)
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--active .inovua-react-toolkit-menu__cell {
        background-color: rgba(139, 181, 141, .15)
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--disabled {
        color: #5e666f;
        fill: #5e666f;
        cursor: not-allowed
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--disabled .inovua-react-toolkit-menu__cell--icon {
        fill: #5e666f
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--disabled .inovua-react-toolkit-menu__cell--secondaryLabel {
        color: #5e666f
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--disabled .inovua-react-toolkit-menu__cell--has-expander .inovua-react-toolkit-menu__expander {
        fill: #5e666f
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell {
        padding: 0 12px 0 8px;
        height: 32px;
        vertical-align: middle
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell:first-child {
        padding: 0 12px
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell.inovua-react-toolkit-menu__cell--ltr:last-child {
        padding-right: 12px
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell.inovua-react-toolkit-menu__cell--rtl:last-child {
        padding-left: 12px
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell--has-input {
        line-height: 16px
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell--has-input.inovua-react-toolkit-menu__cell--ltr {
        padding-right: 0;
        padding-left: 12px
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell--has-input.inovua-react-toolkit-menu__cell--rtl {
        padding-left: 0;
        padding-right: 12px
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell--checkbox, .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell--radio {
        fill: #9ba7b4
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell--checkbox .inovua-react-toolkit-menu__cell__input, .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell--radio .inovua-react-toolkit-menu__cell__input {
        position: relative;
        top: 0
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell--checkbox .inovua-react-toolkit-menu__cell__input--browser-native, .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell--radio .inovua-react-toolkit-menu__cell__input--browser-native {
        top: 0
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell--secondaryLabel {
        color: #7d8690;
        padding-right: 6px;
        text-align: end
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell--secondaryLabel.inovua-react-toolkit-menu__cell--ltr {
        padding-right: 6px
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell--secondaryLabel.inovua-react-toolkit-menu__cell--rtl {
        padding-left: 6px
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell.inovua-react-toolkit-menu__cell--icon.inovua-react-toolkit-menu__cell--ltr {
        padding-right: 3px
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell.inovua-react-toolkit-menu__cell--icon.inovua-react-toolkit-menu__cell--rtl {
        padding-left: 3px
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell.inovua-react-toolkit-menu__cell--icon svg {
        vertical-align: middle
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark.inovua-react-toolkit-menu--rtl .inovua-react-toolkit-menu__cell.inovua-react-toolkit-menu__cell--icon {
        padding-right: 12px;
        padding-left: 3px
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell.inovua-react-toolkit-menu__cell--has-expander {
        text-align: right;
        text-align: end;
        fill: #737f8b
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell.inovua-react-toolkit-menu__cell--has-expander.inovua-react-toolkit-menu__cell--ltr {
        padding-right: 0
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__cell.inovua-react-toolkit-menu__cell--has-expander.inovua-react-toolkit-menu__cell--rtl {
        padding-left: 0
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__menu-separator td {
        padding: 8px 0
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__menu-separator td .inovua-react-toolkit-menu__menu-separator__tool {
        background-color: #4f575f
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__menu-separator__tool {
        background: transparent;
        height: 1px
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--title {
        font-weight: 600;
        cursor: auto
      }

      .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark.inovua-react-toolkit-menu--mobile .inovua-react-toolkit-toolbar__arrow {
        height: 20px
      }

      @media (-ms-high-contrast: none), screen and (-ms-high-contrast: active) {
        .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--focused {
          color: #c5cae9;
          fill: #c5cae9;
          background-color: #e8f2ff;
          border: 1px dotted #8bb58d
        }
        .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--focused .inovua-react-toolkit-menu__cell {
          background-color: #e8f2ff
        }
        .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--focused .inovua-react-toolkit-menu__cell:before, .inovua-react-toolkit-menu.inovua-react-toolkit-menu--theme-green-dark .inovua-react-toolkit-menu__row--focused.inovua-react-toolkit-menu__row--over .inovua-react-toolkit-menu__cell:before {
          content: none
        }
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default {
        color: #e9ecf0;
        fill: #e9ecf0;
        font-size: 14px;
        min-height: 32px;
        overflow: hidden;
        border: 1px solid transparent
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled) .inovua-react-toolkit-split-button__icon-wrap:hover {
        background: #526a95
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default.inovua-react-toolkit-split-button--focused {
        border: 1px dotted #3c5c99
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-split-button__button {
        padding: 4px 8px;
        color: #e9ecf0;
        font-size: 14px;
        background: #495e85
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-split-button__button:not(.inovua-react-toolkit-button--disabled):active, .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-split-button__button:not(.inovua-react-toolkit-button--disabled):hover, .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled) .inovua-react-toolkit-dropdown-button__button:hover {
        background: #526a95
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-dropdown-button__button {
        overflow: hidden;
        background: #495e85;
        fill: #e9ecf0
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default.inovua-react-toolkit-split-button--expanded .inovua-react-toolkit-dropdown-button__button {
        background: #526a95
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-split-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap {
        margin-right: 6px
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-split-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap {
        margin-left: 6px
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-dropdown-button__button:not(.inovua-react-toolkit-button--disabled) .inovua-react-toolkit-button__icon-wrap:hover:not(.inovua-react-toolkit-button__icon-wrap--disabled) {
        background: #526a95
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled) .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap {
        border-left: 1px solid #e9ecf0
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled) .inovua-react-toolkit-dropdown-button--expanded .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled):active .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled):hover .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap {
        border-left: 1px solid #fff
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap {
        border-right: 1px solid #e9ecf0
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap:hover:not(.inovua-react-toolkit-button__icon-wrap--disabled), .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled) .inovua-react-toolkit-dropdown-button--expanded .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled):active .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled):hover .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap {
        border-right: 1px solid #fff
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap {
        border-right: 1px solid #e9ecf0
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap:hover:not(.inovua-react-toolkit-button__icon-wrap--disabled), .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled) .inovua-react-toolkit-dropdown-button--expanded .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled):active .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled):hover .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap {
        border-right: 1px solid #fff
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap {
        border-left: 1px solid #e9ecf0
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap:hover:not(.inovua-react-toolkit-button__icon-wrap--disabled), .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled) .inovua-react-toolkit-dropdown-button--expanded .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled):active .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled):hover .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap {
        border-left: 1px solid #fff
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-split-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap {
        margin-left: 6px
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-split-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap {
        margin-right: 6px
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-dropdown-button__arrow {
        padding-left: 2px;
        padding-right: 2px
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__text {
        padding-left: 0
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-dropdown-button__arrow {
        margin-right: 6px;
        padding-left: 8px
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__text {
        padding-right: 0
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-dropdown-button__arrow {
        margin-left: 6px;
        padding-right: 8px
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__text {
        padding-right: 0
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-dropdown-button__arrow {
        margin-left: 6px;
        padding-right: 8px
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__text {
        padding-left: 0
      }

      .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-dropdown-button__arrow {
        margin-right: 6px;
        padding-left: 8px
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark {
        border: 1px solid #4f575f;
        padding: 2px;
        background: #313943;
        color: #9ba7b4;
        fill: #9ba7b4;
        font-size: 14px
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-button--theme-default:not(.inovua-react-toolkit-split-button__button):not(.inovua-react-toolkit-dropdown-button__button), .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-split-button__button {
        padding: 4px 8px
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-numeric-input, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark input:not(.inovua-react-toolkit-combo-box__input):not(.inovua-react-toolkit-text-input__input):not(.inovua-react-toolkit-date-input__input):not(.inovua-react-toolkit-numeric-input__input) {
        border: 1px solid #4f575f;
        outline: none
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--focused, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark input:not(.inovua-react-toolkit-combo-box__input):not(.inovua-react-toolkit-text-input__input):not(.inovua-react-toolkit-date-input__input):not(.inovua-react-toolkit-numeric-input__input):focus {
        border: 1px solid #8bb58d
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button > .inovua-react-toolkit-dropdown-button .inovua-react-toolkit-dropdown-button__button {
        padding: 0
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled) .inovua-react-toolkit-dropdown-button--expanded .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled) .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled):active .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled):hover .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap {
        border-left: 1px solid #4f575f
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap:hover:not(.inovua-react-toolkit-button__icon-wrap--disabled), .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap:hover:not(.inovua-react-toolkit-button__icon-wrap--disabled), .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled) .inovua-react-toolkit-dropdown-button--expanded .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled) .inovua-react-toolkit-dropdown-button--expanded .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled):active .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled):active .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled):hover .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled):hover .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap {
        border-right: 1px solid #4f575f
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap:hover:not(.inovua-react-toolkit-button__icon-wrap--disabled), .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled) .inovua-react-toolkit-dropdown-button--expanded .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled):active .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button--theme-default:not(.inovua-react-toolkit-split-button--disabled):hover .inovua-react-toolkit-dropdown-button__button.inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap {
        border-left: 1px solid #4f575f
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark.inovua-react-toolkit-toolbar--change-button-styles .inovua-react-toolkit-button.inovua-react-toolkit-button.inovua-react-toolkit-button, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark.inovua-react-toolkit-toolbar--change-button-styles .inovua-react-toolkit-dropdown-button.inovua-react-toolkit-dropdown-button.inovua-react-toolkit-dropdown-button, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark.inovua-react-toolkit-toolbar--change-button-styles .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button.inovua-react-toolkit-split-button {
        transition: background-color .2s;
        font-size: 14px;
        color: #9ba7b4;
        fill: #9ba7b4
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark.inovua-react-toolkit-toolbar--change-button-styles .inovua-react-toolkit-button.inovua-react-toolkit-button.inovua-react-toolkit-button:not(:hover), .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark.inovua-react-toolkit-toolbar--change-button-styles .inovua-react-toolkit-dropdown-button.inovua-react-toolkit-dropdown-button.inovua-react-toolkit-dropdown-button:not(:hover), .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark.inovua-react-toolkit-toolbar--change-button-styles .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button.inovua-react-toolkit-split-button:not(:hover) {
        background-color: transparent
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark.inovua-react-toolkit-toolbar--change-button-styles .inovua-react-toolkit-button.inovua-react-toolkit-button.inovua-react-toolkit-button:hover, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark.inovua-react-toolkit-toolbar--change-button-styles .inovua-react-toolkit-dropdown-button.inovua-react-toolkit-dropdown-button.inovua-react-toolkit-dropdown-button:hover, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark.inovua-react-toolkit-toolbar--change-button-styles .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button.inovua-react-toolkit-split-button:hover {
        background-color: #313943
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark.inovua-react-toolkit-toolbar--change-button-styles .inovua-react-toolkit-button.inovua-react-toolkit-button.inovua-react-toolkit-button.inovua-react-toolkit-button--disabled, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark.inovua-react-toolkit-toolbar--change-button-styles .inovua-react-toolkit-dropdown-button.inovua-react-toolkit-dropdown-button.inovua-react-toolkit-dropdown-button.inovua-react-toolkit-button--disabled, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark.inovua-react-toolkit-toolbar--change-button-styles .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button.inovua-react-toolkit-split-button.inovua-react-toolkit-button--disabled {
        opacity: .5;
        background-color: transparent
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark.inovua-react-toolkit-toolbar--change-button-styles .inovua-react-toolkit-button.inovua-react-toolkit-button.inovua-react-toolkit-button:not(.inovua-react-toolkit-button--disabled):hover, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark.inovua-react-toolkit-toolbar--change-button-styles .inovua-react-toolkit-dropdown-button.inovua-react-toolkit-dropdown-button.inovua-react-toolkit-dropdown-button:not(.inovua-react-toolkit-button--disabled):hover, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark.inovua-react-toolkit-toolbar--change-button-styles .inovua-react-toolkit-split-button.inovua-react-toolkit-split-button.inovua-react-toolkit-split-button:not(.inovua-react-toolkit-button--disabled):hover {
        background-color: #313943
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-toolbar__separator {
        background: #4f575f
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-toolbar__arrow, .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-toolbar__arrow:hover {
        background: #313943
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-toolbar__arrow--direction-right {
        border-left: 1px solid #4f575f
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-toolbar__arrow--direction-left {
        border-right: 1px solid #4f575f
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-toolbar__arrow--direction-down {
        border-top: 1px solid #4f575f
      }

      .inovua-react-toolkit-toolbar.inovua-react-toolkit-toolbar--theme-green-dark .inovua-react-toolkit-toolbar__arrow--direction-up {
        border-bottom: 1px solid #4f575f
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark {
        font-size: 14px;
        fill: #9ba7b4;
        border: 1px solid transparent;
        background: #464d56;
        min-height: 26px;
        border-radius: 1px;
        transition: all .2s;
        position: relative
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark:hover {
        border: 1px solid #8bb58d
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__input {
        color: #9ba7b4;
        font-size: 14px
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__input:-ms-input-placeholder {
        color: rgba(155, 167, 180, .5)
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__input::placeholder {
        color: rgba(155, 167, 180, .5)
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark.inovua-react-toolkit-numeric-input--disabled {
        fill: rgba(155, 167, 180, .7);
        opacity: .5
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark.inovua-react-toolkit-numeric-input--focused {
        border: 1px solid #8bb58d;
        box-shadow: 0 0 0 2px rgba(139, 181, 141, .4)
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__clear-button-wrapper {
        margin-left: 6px
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__clear-button-wrapper .inovua-react-toolkit-numeric-input__clear-button {
        stroke: #9ba7b4
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__clear-button-wrapper .inovua-react-toolkit-numeric-input__clear-button:hover {
        stroke: #e8e8e8
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__clear-button-wrapper .inovua-react-toolkit-numeric-input__clear-button:focus {
        outline: 1px solid #8bb58d
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__spinner-wrapper {
        width: 24px;
        height: 30px;
        min-height: 20px
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__spinner-wrapper.inovua-react-toolkit-numeric-input__spinner-wrapper--ltr {
        margin: 0
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__spinner-wrapper.inovua-react-toolkit-numeric-input__spinner-wrapper--rtl {
        margin: 4px 0 4px 6px
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__spinner-wrapper-hidden.inovua-react-toolkit-numeric-input__spinner-wrapper-hidden--ltr {
        margin: 0 6px 0 0
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__spinner-wrapper-hidden.inovua-react-toolkit-numeric-input__spinner-wrapper-hidden--rtl {
        margin: 0 0 0 6px
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__input {
        min-height: 26px;
        margin: 2px 0
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__spinner-arrow {
        padding: 0 6px
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__spinner-arrow svg {
        transform: translateY(0);
        pointer-events: none
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__spinner-arrow--down:hover, .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__spinner-arrow--up:hover {
        background: rgba(139, 181, 141, .15);
        fill: #e8e8e8
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__spinner-arrow--down:active, .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__spinner-arrow--up:active {
        background: rgba(139, 181, 141, .25);
        fill: #e8e8e8
      }

      .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__spinner-arrow--down:active svg, .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--theme-green-dark .inovua-react-toolkit-numeric-input__spinner-arrow--up:active svg {
        transform: translateY(0)
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark {
        font-size: 14px;
        border: 1px solid transparent;
        border-radius: 1px;
        background: #464d56;
        fill: #9ba7b4;
        stroke: #9ba7b4;
        padding-top: 2px;
        min-width: 100px;
        box-shadow: none;
        transition: all .2s;
        position: relative
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark:hover:not(.inovua-react-toolkit-combo-box--disabled) {
        border: 1px solid #8bb58d
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark, .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark input {
        color: #9ba7b4
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark input {
        padding: 0
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__input__placeholder {
        color: rgba(155, 167, 180, .5);
        white-space: nowrap
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark.inovua-react-toolkit-combo-box--focus {
        background: #353c45;
        border: 1px solid #8bb58d;
        box-shadow: 0 0 0 2px rgba(139, 181, 141, .4)
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark.inovua-react-toolkit-combo-box--ltr {
        padding-right: 3px
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark.inovua-react-toolkit-combo-box--ltr .inovua-react-toolkit-combo-box__input__wrapper, .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark.inovua-react-toolkit-combo-box--ltr .inovua-react-toolkit-combo-box__value__display-value {
        padding-left: 8px
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark.inovua-react-toolkit-combo-box--rtl {
        padding-left: 3px
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark.inovua-react-toolkit-combo-box--rtl .inovua-react-toolkit-combo-box__input__wrapper, .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark.inovua-react-toolkit-combo-box--rtl .inovua-react-toolkit-combo-box__value__display-value {
        padding-right: 8px
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark.inovua-react-toolkit-combo-box--disabled {
        fill: #9ba7b4;
        opacity: .5
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark.inovua-react-toolkit-combo-box--shadow .inovua-react-toolkit-combo-box__list {
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, .4)
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__list__loading-text {
        background: hsla(0, 0%, 100%, .4);
        color: #858585
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__loading-spinner {
        width: 17px;
        display: flex;
        align-items: center
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__loading-spinner svg {
        animation: react-toolkit-combo-box-loading-animation-default 1.4s linear infinite;
        transform: translateZ(0)
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__clear-icon {
        cursor: pointer;
        display: flex;
        align-items: center;
        margin: 0 8px 0 6px;
        transform: translateY(0);
        transition: stroke .25s ease-in-out
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__clear-icon:active {
        transform: translateY(1px)
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__clear-icon:hover svg {
        stroke: #e8e8e8
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__tools, .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__value {
        min-height: 27px
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__tools .inovua-react-toolkit-combo-box__toggle-icon:hover {
        fill: #e8e8e8;
        stroke: #e8e8e8
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__tools .inovua-react-toolkit-combo-box__toggle-icon:hover:before {
        background: rgba(139, 181, 141, .15)
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__tools .inovua-react-toolkit-combo-box__toggle-icon:active:before {
        background: rgba(139, 181, 141, .25)
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__tools .inovua-react-toolkit-combo-box__toggle-icon:before {
        content: "";
        position: absolute;
        top: -2px;
        right: -6px;
        width: 22px;
        height: calc(100% + 3px);
        background: transparent
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__value__tag {
        background: #464d56;
        border: 1px solid #60676e;
        border-radius: 1px;
        padding: 3px 8px
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__value__tag--active {
        border: 1px solid #8bb58d
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__value__tag--active.inovua-react-toolkit-combo-box__value__tag--selected {
        background: #464d56
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__value__tag__clear-icon {
        transform: translateY(0)
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__value__tag__clear-icon:active {
        transform: translateY(1px)
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark.inovua-react-toolkit-combo-box--ltr .inovua-react-toolkit-combo-box__value__tag__clear-icon {
        margin-left: 12px
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark.inovua-react-toolkit-combo-box--ltr .inovua-react-toolkit-combo-box__value__tag {
        margin-right: 2px;
        margin-bottom: 2px
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark.inovua-react-toolkit-combo-box--rtl .inovua-react-toolkit-combo-box__value__tag__clear-icon {
        margin-right: 12px
      }

      .inovua-react-toolkit-combo-box.inovua-react-toolkit-combo-box--theme-green-dark.inovua-react-toolkit-combo-box--rtl .inovua-react-toolkit-combo-box__value__tag {
        margin-left: 2px;
        margin-bottom: 2px
      }

      @keyframes react-toolkit-combo-box-loading-animation-default {
        0% {
          transform: rotate(0deg)
        }
        to {
          transform: rotate(1turn)
        }
      }

      .inovua-react-toolkit-combo-box__list--theme-green-dark {
        background: #313943;
        border-radius: 1px;
        border: none;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, .4)
      }

      .inovua-react-toolkit-combo-box__list--theme-green-dark .inovua-react-toolkit-combo-box__list__item {
        padding: 5px 8px;
        border: 1px solid transparent
      }

      .inovua-react-toolkit-combo-box__list--theme-green-dark .inovua-react-toolkit-combo-box__list__item:not(.inovua-react-toolkit-combo-box__list__item--disabled):hover {
        background: rgba(139, 181, 141, .15)
      }

      .inovua-react-toolkit-combo-box__list--theme-green-dark .inovua-react-toolkit-combo-box__list__item--selected {
        background: rgba(139, 181, 141, .25)
      }

      .inovua-react-toolkit-combo-box__list--theme-green-dark .inovua-react-toolkit-combo-box__list__item--active {
        border: 1px solid transparent
      }

      .inovua-react-toolkit-combo-box__list--theme-green-dark .inovua-react-toolkit-combo-box__list__item--disabled {
        color: #9ba7b4;
        cursor: default
      }

      .inovua-react-toolkit-combo-box__list--theme-green-dark .inovua-react-toolkit-combo-box__list__item__highlight {
        background: #f0f;
        font-weight: 700
      }

      .inovua-react-toolkit-combo-box__list--theme-green-dark .inovua-react-toolkit-combo-box__list__group {
        padding: 5px 3px;
        font-weight: 700
      }

      .inovua-react-toolkit-combo-box__list--theme-green-dark .inovua-react-toolkit-combo-box__list__virtual-list {
        background: #313943
      }

      .inovua-react-toolkit-combo-box__list--theme-green-dark .inovua-react-toolkit-combo-box__list__virtual-list::-webkit-scrollbar {
        width: 8px
      }

      .inovua-react-toolkit-combo-box__list--theme-green-dark .inovua-react-toolkit-combo-box__list__virtual-list::-webkit-scrollbar-track {
        background-color: rgba(115, 127, 139, .3);
        border-radius: 2px
      }

      .inovua-react-toolkit-combo-box__list--theme-green-dark .inovua-react-toolkit-combo-box__list__virtual-list::-webkit-scrollbar-thumb {
        background: rgba(115, 127, 139, .3);
        border-radius: 2px
      }

      .inovua-react-toolkit-combo-box__list--theme-green-dark .inovua-react-toolkit-combo-box__list__virtual-list::-webkit-scrollbar-button {
        display: none
      }

      .inovua-react-toolkit-button.inovua-react-toolkit-button--theme-green-dark {
        color: #8bb58d;
        fill: #8bb58d;
        font-size: 14px;
        border-radius: 1px;
        transition: background .2s, transform .2s
      }

      .inovua-react-toolkit-button.inovua-react-toolkit-button--theme-green-dark:not(.inovua-react-toolkit-dropdown-button__button):not(.inovua-react-toolkit-split-button__button) {
        background: #313943 padding-box;
        transform: translateY(0);
        border: 1px solid #8bb58d;
        min-height: 28px;
        padding: 4px 8px
      }

      .inovua-react-toolkit-button.inovua-react-toolkit-button--theme-green-dark:not(.inovua-react-toolkit-dropdown-button__button):not(.inovua-react-toolkit-split-button__button):not(.inovua-react-toolkit-button--disabled):active {
        transform: translateY(1px)
      }

      .inovua-react-toolkit-button.inovua-react-toolkit-button--theme-green-dark:not(.inovua-react-toolkit-dropdown-button__button):not(.inovua-react-toolkit-split-button__button):not(.inovua-react-toolkit-button--disabled):hover {
        background: rgba(139, 181, 141, .15) padding-box
      }

      .inovua-react-toolkit-button.inovua-react-toolkit-button--theme-green-dark:not(.inovua-react-toolkit-dropdown-button__button):not(.inovua-react-toolkit-split-button__button):not(.inovua-react-toolkit-button--disabled).inovua-react-toolkit-button--pressed {
        background: rgba(139, 181, 141, .25) padding-box
      }

      .inovua-react-toolkit-button.inovua-react-toolkit-button--theme-green-dark:not(.inovua-react-toolkit-dropdown-button__button):not(.inovua-react-toolkit-split-button__button):not(.inovua-react-toolkit-button--disabled).inovua-react-toolkit-button--pressed:hover {
        background: rgba(161, 195, 162, .25) padding-box
      }

      .inovua-react-toolkit-button.inovua-react-toolkit-button--theme-green-dark:not(.inovua-react-toolkit-dropdown-button__button):not(.inovua-react-toolkit-split-button__button).inovua-react-toolkit-button--focused {
        border: 1px solid #8bb58d;
        box-shadow: 0 0 0 3px rgba(139, 181, 141, .4);
        transition: border .2s
      }

      .inovua-react-toolkit-button.inovua-react-toolkit-button--theme-green-dark.inovua-react-toolkit-button--disabled {
        color: #8bb58d;
        fill: #8bb58d;
        opacity: .5
      }

      .inovua-react-toolkit-button.inovua-react-toolkit-button--theme-green-dark.inovua-react-toolkit-button--has-icon:not(.inovua-react-toolkit-button--no-children):not(.inovua-react-toolkit-dropdown-button__button):not(.inovua-react-toolkit-split-button__button).inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap {
        margin-right: 6px
      }

      .inovua-react-toolkit-button.inovua-react-toolkit-button--theme-green-dark.inovua-react-toolkit-button--has-icon:not(.inovua-react-toolkit-button--no-children):not(.inovua-react-toolkit-dropdown-button__button):not(.inovua-react-toolkit-split-button__button).inovua-react-toolkit-button--ltr.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap, .inovua-react-toolkit-button.inovua-react-toolkit-button--theme-green-dark.inovua-react-toolkit-button--has-icon:not(.inovua-react-toolkit-button--no-children):not(.inovua-react-toolkit-dropdown-button__button):not(.inovua-react-toolkit-split-button__button).inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-first .inovua-react-toolkit-button__icon-wrap {
        margin-left: 6px
      }

      .inovua-react-toolkit-button.inovua-react-toolkit-button--theme-green-dark.inovua-react-toolkit-button--has-icon:not(.inovua-react-toolkit-button--no-children):not(.inovua-react-toolkit-dropdown-button__button):not(.inovua-react-toolkit-split-button__button).inovua-react-toolkit-button--rtl.inovua-react-toolkit-button--icon-last .inovua-react-toolkit-button__icon-wrap {
        margin-right: 6px
      }

      .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark {
        padding: 2px 4px;
        background: #313943;
        fill: #9ba7b4
      }

      .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark, .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark input {
        color: #9ba7b4;
        font-size: 14px
      }

      .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark.inovua-react-pagination-toolbar--bordered {
        border: 1px solid #464d56
      }

      .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-pagination-toolbar__per-page-text {
        margin-left: 8px
      }

      .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-toolkit-button:not(.inovua-react-toolkit-dropdown-button__button):not(.inovua-react-toolkit-split-button__button) {
        padding: 2px;
        border-radius: 1px;
        border: 1px solid transparent
      }

      .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-toolkit-combo-box--theme-green-dark, .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-toolkit-combo-box--theme-green-dark .inovua-react-toolkit-combo-box__list, .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-toolkit-numeric-input--theme-green-dark, .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark input:not(.inovua-react-toolkit-numeric-input__input) {
        border: 1px solid #464d56;
        outline: none
      }

      .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-toolkit-combo-box--focus.inovua-react-toolkit-combo-box--theme-green-dark, .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-toolkit-numeric-input.inovua-react-toolkit-numeric-input--focused, .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark input:not(.inovua-react-toolkit-numeric-input__input):focus {
        border: 1px solid #8bb58d
      }

      .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-toolkit-toolbar__separator {
        background: #464d56;
        margin: 7px 8px
      }

      .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-pagination-toolbar__page-size-combo {
        background: #464d56;
        margin-right: 8px
      }

      .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-pagination-toolbar__region {
        padding-top: 2px;
        padding-bottom: 2px
      }

      .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-pagination-toolbar__region .inovua-react-pagination-toolbar__icon {
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        fill: #9ba7b4
      }

      .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-pagination-toolbar__region .inovua-react-pagination-toolbar__icon.inovua-react-toolkit-button--over:not(.inovua-react-pagination-toolbar__icon--disabled).inovua-react-toolkit-button, .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-pagination-toolbar__region .inovua-react-pagination-toolbar__icon.inovua-react-toolkit-button--over:not(.inovua-react-pagination-toolbar__icon--disabled).inovua-react-toolkit-button:hover {
        background: rgba(139, 181, 141, .15)
      }

      .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-pagination-toolbar__region .inovua-react-pagination-toolbar__icon--focused {
        background: rgba(139, 181, 141, .25)
      }

      .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-pagination-toolbar__region .inovua-react-pagination-toolbar__icon--named--FIRST_PAGE {
        margin-left: 4px;
        margin-right: 3px
      }

      .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-pagination-toolbar__region .inovua-react-pagination-toolbar__icon--named--NEXT_PAGE {
        margin-right: 3px
      }

      .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark .inovua-react-pagination-toolbar__region .inovua-react-pagination-toolbar__icon--named--REFRESH {
        margin-right: 8px
      }

      .inovua-react-toolkit-load-mask.inovua-react-toolkit-load-mask--theme-green-dark {
        fill: transparent
      }

      .inovua-react-toolkit-load-mask.inovua-react-toolkit-load-mask--theme-green-dark .inovua-react-toolkit-load-mask__background-layer {
        background: rgba(0, 0, 0, .4)
      }

      .inovua-react-toolkit-load-mask.inovua-react-toolkit-load-mask--theme-green-dark .inovua-react-toolkit-load-mask__loader--svg {
        position: relative;
        animation: inovua-react-toolkit-loadmask-spin 1.5s linear infinite
      }

      .inovua-react-toolkit-load-mask.inovua-react-toolkit-load-mask--theme-green-dark .inovua-react-toolkit-load-mask__loader--svg .inovua-react-toolkit-load-mask__loader-spinner {
        border-radius: 50%;
        background-image: conic-gradient(from 90deg, #e3e3e3, #8bb58d .99turn, #e3e3e3);
        object-fit: contain;
        z-index: 9000
      }

      .inovua-react-toolkit-load-mask.inovua-react-toolkit-load-mask--theme-green-dark .inovua-react-toolkit-load-mask__loader--svg:after {
        content: "";
        position: absolute;
        top: 4px;
        left: 4px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        z-index: 10000;
        background: transparent
      }

      .inovua-react-toolkit-load-mask.inovua-react-toolkit-load-mask--theme-green-dark .inovua-react-toolkit-load-mask__loader--svg:before {
        content: "";
        position: absolute;
        top: 4px;
        left: 4px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #313943;
        z-index: 10000
      }

      @keyframes inovua-react-toolkit-loadmask-spin {
        to {
          transform: rotate(1turn)
        }
      }

      .inovua-react-toolkit-load-mask.inovua-react-toolkit-load-mask--theme-green-dark .inovua-react-toolkit-load-mask__loader-loadbar {
        border-radius: 50px;
        box-shadow: 0 0 3px rgba(139, 181, 141, .2)
      }

      .InovuaReactDataGrid--theme-green-dark .inovua-react-toolkit-load-mask__loader-container .InovuaReactDataGrid__loading-wrapper {
        margin-top: 16px
      }

      .InovuaReactDataGrid--theme-green-dark .inovua-react-toolkit-load-mask__loader-container .InovuaReactDataGrid__loading-wrapper .InovuaReactDataGrid__loading-text {
        font-weight: 500;
        color: #9ba7b4
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__load-mask--live-pagination {
        background: none
      }

      .InovuaReactDataGrid--theme-green-dark .inovua-react-pagination-toolbar {
        flex: none
      }

      .InovuaReactDataGrid--theme-green-dark .inovua-react-pagination-toolbar.inovua-react-pagination-toolbar--theme-green-dark {
        border: none;
        border-top: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__filter--select__scroller.inovua-react-scroll-container__scroller {
        outline: none
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__filter--select__scroller.inovua-react-scroll-container__scroller::-webkit-scrollbar {
        width: 14px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__filter--select__scroller.inovua-react-scroll-container__scroller::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 0 10px #737f8b;
        border: 4px solid transparent;
        border-radius: 10px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__filter--select__scroller.inovua-react-scroll-container__scroller::-webkit-scrollbar-corner {
        background: transparent
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__filter--select__scroller.inovua-react-scroll-container__scroller::-webkit-scrollbar-button {
        display: none
      }

      .InovuaReactDataGrid--theme-green-dark .inovua-react-toolkit-radio-button {
        margin-bottom: 0
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__checkbox {
        margin: 3px
      }

      .InovuaReactDataGrid--theme-green-dark {
        border: 1px solid #4f575f;
        background: #313943;
        color: #9ba7b4;
        fill: #9ba7b4;
        font-size: 14px
      }

      .InovuaReactDataGrid--theme-green-dark:focus {
        outline: none
      }

      .inovua-react-panel--theme-THEME_NAME .InovuaReactDataGrid--theme-green-dark, .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--paginated:not(.InovuaReactDataGrid--live-pagination) {
        border: 1px solid #a1b6d3
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-rows-container {
        border-top: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row--show-border-bottom:not(:last-child) {
        border-bottom: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-rows-container--position-start .InovuaReactDataGrid__locked-row--last-in-section {
        border-bottom: 3px solid #616b75
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-rows-container--position-end .InovuaReactDataGrid__locked-row--first-in-section {
        border-top: 3px solid #616b75
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-resize-indicator--hovered {
        background: #8bb58d
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-resize-indicator--active, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-resize-indicator--active.InovuaReactDataGrid__row-resize-indicator--mobile {
        background: rgba(139, 181, 141, .5)
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-resize-indicator--constrained, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-resize-indicator--constrained.InovuaReactDataGrid__row-resize-indicator--mobile {
        background: rgba(232, 64, 54, .5)
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-index-column {
        background: #343d48
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-resize-handle:after {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        content: ""
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-details-border {
        border-left: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-drag-proxy {
        background: #3b4450;
        border: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-reorder-arrow {
        pointer-events: none;
        position: absolute;
        height: 3px;
        width: 40px;
        z-index: 99
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-reorder-arrow--valid {
        background: #8bb58d
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-reorder-arrow--invalid {
        background: #f54
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-drag-scrolling-region {
        position: absolute;
        left: 0;
        width: 100%;
        height: 40px;
        z-index: 100;
        display: none
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--scrolling:not(.InovuaReactDataGrid__row--natural-rowheight):not(.InovuaReactDataGrid__row--has-rowspan) {
        contain: strict !important
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--scrolling {
        pointer-events: none
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row .InovuaReactDataGrid__row-details {
        background: #313943
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row .InovuaReactDataGrid__row-details.InovuaReactDataGrid__row-details--details-grid {
        padding: 8px 0
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row .InovuaReactDataGrid__row-details > .InovuaReactDataGrid {
        margin: 0 8px;
        width: auto
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row .InovuaReactDataGrid__row-details.InovuaReactDataGrid__row-details--show-border-bottom + .InovuaReactDataGrid__row-details-special-bottom-border {
        border-bottom: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row .InovuaReactDataGrid__row-details--min-viewport-width + .InovuaReactDataGrid__row-details-special-top-border, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row .InovuaReactDataGrid__row-details--viewport-width + .InovuaReactDataGrid__row-details-special-top-border {
        position: absolute;
        width: 100%;
        top: -1px;
        left: 0;
        border-top: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row:not(.InovuaReactDataGrid__row--show-vertical-borders) .InovuaReactDataGrid__row-details {
        border-top: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row:not(.InovuaReactDataGrid__row--show-horizontal-borders) .InovuaReactDataGrid__row-details + .InovuaReactDataGrid__row-details-special-top-border {
        display: none
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row.InovuaReactDataGrid__row--show-horizontal-borders .InovuaReactDataGrid__row-details {
        border-top: 0
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row.InovuaReactDataGrid__row--show-horizontal-borders .InovuaReactDataGrid__row-details.InovuaReactDataGrid__row-details--show-border-bottom .InovuaReactDataGrid__row-details-special-bottom-border {
        border-bottom: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row.InovuaReactDataGrid__row--selected {
        background: rgba(139, 181, 141, .25)
      }

      // todo change
      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--even, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--no-zebra {
        background: #313943
      }

      // todo change
      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--even.InovuaReactDataGrid__row--selected, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--even.InovuaReactDataGrid__row--selected .InovuaReactDataGrid__row-index-column, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--no-zebra.InovuaReactDataGrid__row--selected, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--no-zebra.InovuaReactDataGrid__row--selected .InovuaReactDataGrid__row-index-column {
        background: #485856
      }

      // todo change
      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--odd {
        // background: #343d48;
        background: black !important;
      }

      // todo change
      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--odd.InovuaReactDataGrid__row--selected, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--odd.InovuaReactDataGrid__row--selected .InovuaReactDataGrid__row-index-column {
        background: #485856
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--active .InovuaReactDataGrid__row-active-borders {
        position: absolute;
        right: 0;
        bottom: 0;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 12000
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--active .InovuaReactDataGrid__row-active-borders:before {
        border: 2px solid transparent;
        content: "";
        position: absolute;
        left: 2px;
        right: 2px;
        top: 1px;
        bottom: 1px;
        pointer-events: none
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--active .InovuaReactDataGrid__row-active-borders.InovuaReactDataGrid__row-active-borders--has-border-top:before {
        top: 2px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--active .InovuaReactDataGrid__row-active-borders.InovuaReactDataGrid__row-active-borders--has-border-bottom:before {
        bottom: 2px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--active .InovuaReactDataGrid__cell:not(.InovuaReactDataGrid__cell--no-background), .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--active.InovuaReactDataGrid__row--even .InovuaReactDataGrid__cell:not(.InovuaReactDataGrid__cell--no-background), .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--active.InovuaReactDataGrid__row--odd .InovuaReactDataGrid__cell:not(.InovuaReactDataGrid__cell--no-background) {
        color: #c5cae9
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--selected {
        background: rgba(139, 181, 141, .25);
        color: #c5cae9
      }

      // todo change
      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-hover-rows .InovuaReactDataGrid__locked-row:hover .InovuaReactDataGrid__locked-row-cell {
        background: #3f4c4e
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-hover-rows .InovuaReactDataGrid__row--even:not(.InovuaReactDataGrid__row--scrolling):not(.InovuaReactDataGrid__row--empty) .InovuaReactDataGrid__row-hover-target:hover {
        background: #3f4c4e;
        color: #c5cae9
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-hover-rows .InovuaReactDataGrid__row--even:not(.InovuaReactDataGrid__row--scrolling):not(.InovuaReactDataGrid__row--empty) .InovuaReactDataGrid__row-hover-target:hover .InovuaReactDataGrid__row-index-column {
        background: #3f4c4e
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-hover-rows .InovuaReactDataGrid__row--even:not(.InovuaReactDataGrid__row--scrolling):not(.InovuaReactDataGrid__row--empty).InovuaReactDataGrid__row--selected .InovuaReactDataGrid__row-hover-target:hover {
        background: #51645d;
        color: #c5cae9
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-hover-rows .InovuaReactDataGrid__row--even:not(.InovuaReactDataGrid__row--scrolling):not(.InovuaReactDataGrid__row--empty).InovuaReactDataGrid__row--selected .InovuaReactDataGrid__row-hover-target:hover .InovuaReactDataGrid__row-index-column {
        background: #51645d
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-hover-rows .InovuaReactDataGrid__row--no-zebra:not(.InovuaReactDataGrid__row--scrolling):not(.InovuaReactDataGrid__row--empty) .InovuaReactDataGrid__row-hover-target:hover, .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-hover-rows .InovuaReactDataGrid__row--odd:not(.InovuaReactDataGrid__row--scrolling):not(.InovuaReactDataGrid__row--empty) .InovuaReactDataGrid__row-hover-target:hover {
        background: #3f4c4e;
        color: #c5cae9
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-hover-rows .InovuaReactDataGrid__row--no-zebra:not(.InovuaReactDataGrid__row--scrolling):not(.InovuaReactDataGrid__row--empty) .InovuaReactDataGrid__row-hover-target:hover .InovuaReactDataGrid__row-index-column, .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-hover-rows .InovuaReactDataGrid__row--odd:not(.InovuaReactDataGrid__row--scrolling):not(.InovuaReactDataGrid__row--empty) .InovuaReactDataGrid__row-hover-target:hover .InovuaReactDataGrid__row-index-column {
        background: #3f4c4e
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-hover-rows .InovuaReactDataGrid__row--no-zebra:not(.InovuaReactDataGrid__row--scrolling):not(.InovuaReactDataGrid__row--empty).InovuaReactDataGrid__row--selected .InovuaReactDataGrid__row-hover-target:hover, .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-hover-rows .InovuaReactDataGrid__row--odd:not(.InovuaReactDataGrid__row--scrolling):not(.InovuaReactDataGrid__row--empty).InovuaReactDataGrid__row--selected .InovuaReactDataGrid__row-hover-target:hover {
        background: #51645d;
        color: #c5cae9
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-hover-rows .InovuaReactDataGrid__row--no-zebra:not(.InovuaReactDataGrid__row--scrolling):not(.InovuaReactDataGrid__row--empty).InovuaReactDataGrid__row--selected .InovuaReactDataGrid__row-hover-target:hover .InovuaReactDataGrid__row-index-column, .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-hover-rows .InovuaReactDataGrid__row--odd:not(.InovuaReactDataGrid__row--scrolling):not(.InovuaReactDataGrid__row--empty).InovuaReactDataGrid__row--selected .InovuaReactDataGrid__row-hover-target:hover .InovuaReactDataGrid__row-index-column {
        background: #51645d
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--focused .InovuaReactDataGrid__row--active > .InovuaReactDataGrid__row-active-borders-wrapper > .InovuaReactDataGrid__row-active-borders:before, .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--focused .InovuaReactDataGrid__row--active > .InovuaReactDataGrid__row-active-borders:before {
        border: 2px solid #8bb58d;
        z-index: 10
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--focused .InovuaReactDataGrid__row--active > .InovuaReactDataGrid__row-active-borders-wrapper {
        z-index: 11000
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--focused .InovuaReactDataGrid__row--active.InovuaReactDataGrid__row--no-locked-start:before {
        border-left: 2px solid #8bb58d;
        z-index: 1
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--focused .InovuaReactDataGrid__row--active.InovuaReactDataGrid__row--no-locked-end:before {
        border-right: 2px solid #8bb58d;
        z-index: 1
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--focused .InovuaReactDataGrid__row--active.InovuaReactDataGrid__row--group-row.InovuaReactDataGrid__row--has-locked-end > .InovuaReactDataGrid__row-active-borders, .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--focused .InovuaReactDataGrid__row--active.InovuaReactDataGrid__row--group-row.InovuaReactDataGrid__row--has-locked-end > .InovuaReactDataGrid__row-active-borders-wrapper > .InovuaReactDataGrid__row-active-borders, .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--focused .InovuaReactDataGrid__row--active.InovuaReactDataGrid__row--group-row.InovuaReactDataGrid__row--has-locked-start > .InovuaReactDataGrid__row-active-borders, .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--focused .InovuaReactDataGrid__row--active.InovuaReactDataGrid__row--group-row.InovuaReactDataGrid__row--has-locked-start > .InovuaReactDataGrid__row-active-borders-wrapper > .InovuaReactDataGrid__row-active-borders {
        background: inherit;
        z-index: 11000
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-reorder-icon svg {
        fill: #495e85
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-wrapper__fill {
        border-bottom: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group {
        font-weight: inherit
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-rtl-scroll-spacer {
        border-left: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header {
        background: #313943
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-end-wrapper, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper {
        background: inherit;
        transition: background
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group__title {
        border-bottom: 1px solid #4f575f;
        -ms-user-select: none;
        user-select: none;
        -webkit-user-select: none
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group__title.InovuaReactDataGrid__header-group__title--empty {
        border-bottom: 1px solid transparent
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__content {
        font-weight: 700
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell:not(.InovuaReactDataGrid__cell--no-padding), .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__content, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group__title, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__nested-cell, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__nested-group-cell {
        padding: 8px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-group, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-group {
        background: #313943
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell {
        font-weight: inherit;
        border-color: #4f575f !important
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__content .InovuaReactDataGrid__sort-icon-wrapper, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__group-toolbar-item .InovuaReactDataGrid__sort-icon-wrapper {
        display: inline-flex;
        flex-direction: column;
        vertical-align: middle
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__content .InovuaReactDataGrid__sort-icon-wrapper .InovuaReactDataGrid__sort-icon, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__group-toolbar-item .InovuaReactDataGrid__sort-icon-wrapper .InovuaReactDataGrid__sort-icon {
        margin-left: 8px;
        margin-right: 8px;
        fill: #515964
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__content .InovuaReactDataGrid__sort-icon-wrapper .InovuaReactDataGrid__sort-icon.InovuaReactDataGrid__sort-icon--asc, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__group-toolbar-item .InovuaReactDataGrid__sort-icon-wrapper .InovuaReactDataGrid__sort-icon.InovuaReactDataGrid__sort-icon--asc {
        margin-bottom: 4px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__content .InovuaReactDataGrid__sort-icon-wrapper .InovuaReactDataGrid__sort-icon.InovuaReactDataGrid__sort-icon--active, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__group-toolbar-item .InovuaReactDataGrid__sort-icon-wrapper .InovuaReactDataGrid__sort-icon.InovuaReactDataGrid__sort-icon--active {
        fill: #9ba7b4
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-resizer {
        -ms-user-select: none;
        user-select: none;
        -webkit-user-select: none;
        height: inherit;
        bottom: 0
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--filterable .InovuaReactDataGrid__column-resizer {
        bottom: 41px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-resize-handle, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group-resize-handle {
        background: #8bb58d
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__resize-proxy {
        width: 4px;
        background: rgba(139, 181, 141, .5)
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__resize-proxy--constrained {
        background: rgba(232, 64, 54, .5)
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header--locked-start.InovuaReactDataGrid__column-header--last-in-section + .InovuaReactDataGrid__column-resizer .InovuaReactDataGrid__column-resize-handle {
        right: -1px;
        z-index: 100
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-wrapper {
        line-height: 1.6
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--direction-rtl .InovuaReactDataGrid__drag-proxy {
        direction: rtl
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__drag-proxy {
        opacity: .7
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__drag-proxy .InovuaReactDataGrid__drag-proxy {
        opacity: 1
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--direction-ltr .InovuaReactDataGrid__header-group--dragging {
        border-top: 1px solid #4f575f;
        border-right: 1px solid #4f575f;
        border-bottom: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--direction-rtl .InovuaReactDataGrid__header-group--dragging {
        border-top: 1px solid #4f575f;
        border-left: 1px solid #4f575f;
        border-bottom: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header--dragging .InovuaReactDataGrid__column-header__menu-tool {
        display: none
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header--dragging.InovuaReactDataGrid__column-header--dragging {
        border: 1px solid #4f575f;
        cursor: grabbing
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__resize-wrapper--show-border-left .InovuaReactDataGrid__column-header--dragging.InovuaReactDataGrid__column-header--dragging {
        border-left: none
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header--show-border-left, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__resize-wrapper--show-border-left, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group__title--show-border-left {
        border-left: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header--direction-ltr.InovuaReactDataGrid__column-header--unresizable.InovuaReactDataGrid__column-header--locked-start.InovuaReactDataGrid__column-header--last-in-section:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__resize-wrapper--direction-ltr.InovuaReactDataGrid__column-header__resize-wrapper--locked-start.InovuaReactDataGrid__column-header__resize-wrapper--last-in-section:after {
        content: "";
        position: absolute;
        right: -3px;
        left: unset;
        top: 0;
        bottom: 0;
        width: 3px;
        border-left: 1px solid #4f575f;
        border-right: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header--direction-ltr.InovuaReactDataGrid__column-header--unresizable.InovuaReactDataGrid__column-header--locked-start.InovuaReactDataGrid__column-header--last-in-section.InovuaReactDataGrid__column-header--dragging:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header--direction-ltr.InovuaReactDataGrid__column-header--unresizable.InovuaReactDataGrid__column-header--locked-start.InovuaReactDataGrid__column-header--last-in-section.InovuaReactDataGrid__column-header__resize-wrapper--dragging:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__resize-wrapper--direction-ltr.InovuaReactDataGrid__column-header__resize-wrapper--locked-start.InovuaReactDataGrid__column-header__resize-wrapper--last-in-section.InovuaReactDataGrid__column-header--dragging:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__resize-wrapper--direction-ltr.InovuaReactDataGrid__column-header__resize-wrapper--locked-start.InovuaReactDataGrid__column-header__resize-wrapper--last-in-section.InovuaReactDataGrid__column-header__resize-wrapper--dragging:after {
        display: none
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header--direction-rtl.InovuaReactDataGrid__column-header--unresizable.InovuaReactDataGrid__column-header--locked-start.InovuaReactDataGrid__column-header--last-in-section:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__resize-wrapper--direction-rtl.InovuaReactDataGrid__column-header__resize-wrapper--locked-start.InovuaReactDataGrid__column-header__resize-wrapper--last-in-section:after {
        content: "";
        position: absolute;
        left: -3px;
        right: unset;
        top: 0;
        bottom: 0;
        width: 3px;
        border-left: 1px solid #4f575f;
        border-right: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header--direction-rtl.InovuaReactDataGrid__column-header--unresizable.InovuaReactDataGrid__column-header--locked-start.InovuaReactDataGrid__column-header--last-in-section.InovuaReactDataGrid__column-header--dragging:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header--direction-rtl.InovuaReactDataGrid__column-header--unresizable.InovuaReactDataGrid__column-header--locked-start.InovuaReactDataGrid__column-header--last-in-section.InovuaReactDataGrid__column-header__resize-wrapper--dragging:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__resize-wrapper--direction-rtl.InovuaReactDataGrid__column-header__resize-wrapper--locked-start.InovuaReactDataGrid__column-header__resize-wrapper--last-in-section.InovuaReactDataGrid__column-header--dragging:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__resize-wrapper--direction-rtl.InovuaReactDataGrid__column-header__resize-wrapper--locked-start.InovuaReactDataGrid__column-header__resize-wrapper--last-in-section.InovuaReactDataGrid__column-header__resize-wrapper--dragging:after {
        display: none
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__drag-proxy .InovuaReactDataGrid__column-header--show-border-left, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__drag-proxy .InovuaReactDataGrid__column-header__resize-wrapper--show-border-left, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__drag-proxy .InovuaReactDataGrid__header-group__title--show-border-left {
        z-index: 10
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group__title {
        border-right: 1px solid transparent;
        font-weight: 700
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group__title--show-border-right {
        border-right: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group__title--direction-ltr.InovuaReactDataGrid__header-group__title--show-border-right.InovuaReactDataGrid__header-group__title--locked-start {
        border-right: none;
        margin-right: 3px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group__title--direction-ltr.InovuaReactDataGrid__header-group__title--show-border-right.InovuaReactDataGrid__header-group__title--locked-start:after {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        border-left: 1px solid #4f575f;
        border-right: 1px solid #4f575f;
        background: #616b75
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group__title--direction-ltr.InovuaReactDataGrid__header-group__title--show-border-left.InovuaReactDataGrid__header-group__title--locked-end.InovuaReactDataGrid__header-group__title--first-in-section {
        margin-left: 3px;
        border-left: none
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group__title--direction-ltr.InovuaReactDataGrid__header-group__title--show-border-left.InovuaReactDataGrid__header-group__title--locked-end.InovuaReactDataGrid__header-group__title--first-in-section:after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        border-left: 1px solid #4f575f;
        border-right: 1px solid #4f575f;
        background: #616b75
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group__title--direction-rtl.InovuaReactDataGrid__header-group__title--show-border-left.InovuaReactDataGrid__header-group__title--locked-start {
        border-left: none;
        margin-left: 3px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group__title--direction-rtl.InovuaReactDataGrid__header-group__title--show-border-left.InovuaReactDataGrid__header-group__title--locked-start:after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        border-left: 1px solid #4f575f;
        border-right: 1px solid #4f575f;
        background: #616b75
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group__title--direction-rtl.InovuaReactDataGrid__header-group__title--show-border-right.InovuaReactDataGrid__header-group__title--locked-end.InovuaReactDataGrid__header-group__title--first-in-section {
        margin-right: 3px;
        border-right: none
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-group__title--direction-rtl.InovuaReactDataGrid__header-group__title--show-border-right.InovuaReactDataGrid__header-group__title--locked-end.InovuaReactDataGrid__header-group__title--first-in-section:after {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        border-left: 1px solid #4f575f;
        border-right: 1px solid #4f575f;
        background: #616b75
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__drag-proxy .InovuaReactDataGrid__column-header--first-in-section, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__drag-proxy.InovuaReactDataGrid__header-group .InovuaReactDataGrid__header-group__title--show-border-left.InovuaReactDataGrid__header-group__title--locked-end.InovuaReactDataGrid__header-group__title--first-in-section, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__drag-proxy .InovuaReactDataGrid__header-group__title--first-in-section, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__drag-proxy .InovuaReactDataGrid__header-group__title--show-border-left.InovuaReactDataGrid__header-group__title--locked-end.InovuaReactDataGrid__header-group__title--first-in-section {
        border-left: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__drag-proxy.InovuaReactDataGrid__header-group .InovuaReactDataGrid__column-header__resize-wrapper, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__drag-proxy.InovuaReactDataGrid__header-group .InovuaReactDataGrid__header-group__title {
        margin-right: 0;
        margin-left: 0
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__drag-proxy.InovuaReactDataGrid__header-group .InovuaReactDataGrid__column-header__resize-wrapper:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__drag-proxy.InovuaReactDataGrid__header-group .InovuaReactDataGrid__header-group__title:after {
        display: none
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-header-border-right.InovuaReactDataGrid--direction-ltr .InovuaReactDataGrid__header-group__title--last:not(.InovuaReactDataGrid__header-group__title--dragging) {
        border-right: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-header-border-right.InovuaReactDataGrid--direction-ltr .InovuaReactDataGrid__column-header__resize-wrapper--show-border-right > .InovuaReactDataGrid__column-header--last:not(.InovuaReactDataGrid__column-header--hidden):not(.InovuaReactDataGrid__drag-proxy) {
        border-right: 0
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-header-border-right.InovuaReactDataGrid--direction-rtl .InovuaReactDataGrid__header-group__title--last:not(.InovuaReactDataGrid__header-group__title--dragging) {
        border-left: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-header-border-right.InovuaReactDataGrid--direction-rtl .InovuaReactDataGrid__column-header__resize-wrapper--show-border-right > .InovuaReactDataGrid__column-header--last:not(.InovuaReactDataGrid__column-header--hidden):not(.InovuaReactDataGrid__drag-proxy) {
        border-left: 0
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-header-border-right.InovuaReactDataGrid--direction-rtl .InovuaReactDataGrid__column-header.InovuaReactDataGrid__drag-proxy {
        border-left: 1px solid #4f575f;
        border-right: 0
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header--show-border-right, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__resize-wrapper--show-border-right {
        border-right: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header.InovuaReactDataGrid__column-header--virtualize-columns.InovuaReactDataGrid__column-header--show-border--left {
        border-left: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-ltr .InovuaReactDataGrid__column-header--show-border-right:last-child, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-ltr .InovuaReactDataGrid__column-header__resize-wrapper--show-border-right:last-child, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-ltr .InovuaReactDataGrid__column-header__resize-wrapper:last-child {
        border-right: 3px solid transparent
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-ltr .InovuaReactDataGrid__column-header--show-border-right:last-child.InovuaReactDataGrid__column-header--show-border-right:last-child, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-ltr .InovuaReactDataGrid__column-header__resize-wrapper--show-border-right:last-child.InovuaReactDataGrid__column-header--show-border-right:last-child, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-ltr .InovuaReactDataGrid__column-header__resize-wrapper:last-child.InovuaReactDataGrid__column-header--show-border-right:last-child {
        padding-right: 2px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-ltr .InovuaReactDataGrid__column-header--show-border-right:last-child > .InovuaReactDataGrid__column-header--show-border-right:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-ltr .InovuaReactDataGrid__column-header__resize-wrapper--show-border-right:last-child > .InovuaReactDataGrid__column-header--show-border-right:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-ltr .InovuaReactDataGrid__column-header__resize-wrapper:last-child > .InovuaReactDataGrid__column-header--show-border-right:after {
        content: "";
        position: absolute;
        right: -1px;
        z-index: 1;
        top: -1px;
        bottom: -1px;
        width: 3px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-rtl .InovuaReactDataGrid__column-header--show-border-left:last-child, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-rtl .InovuaReactDataGrid__column-header__resize-wrapper--show-border-left:last-child, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-rtl .InovuaReactDataGrid__column-header__resize-wrapper:last-child {
        border-left: 3px solid transparent
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-rtl .InovuaReactDataGrid__column-header--show-border-left:last-child.InovuaReactDataGrid__column-header--show-border-left:last-child, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-rtl .InovuaReactDataGrid__column-header__resize-wrapper--show-border-left:last-child.InovuaReactDataGrid__column-header--show-border-left:last-child, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-rtl .InovuaReactDataGrid__column-header__resize-wrapper:last-child.InovuaReactDataGrid__column-header--show-border-left:last-child {
        padding-left: 2px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-rtl .InovuaReactDataGrid__column-header--show-border-left:last-child > .InovuaReactDataGrid__column-header--show-border-right:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-rtl .InovuaReactDataGrid__column-header__resize-wrapper--show-border-left:last-child > .InovuaReactDataGrid__column-header--show-border-right:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-start-wrapper--direction-rtl .InovuaReactDataGrid__column-header__resize-wrapper:last-child > .InovuaReactDataGrid__column-header--show-border-right:after {
        content: "";
        position: absolute;
        right: -1px;
        z-index: 1;
        top: -1px;
        bottom: -1px;
        width: 3px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-end-wrapper--direction-ltr .InovuaReactDataGrid__column-header--show-border-left.InovuaReactDataGrid__column-header--locked-end.InovuaReactDataGrid__column-header--first-in-section, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-end-wrapper--direction-ltr .InovuaReactDataGrid__column-header__resize-wrapper--show-border-left.InovuaReactDataGrid__column-header__resize-wrapper--locked-end.InovuaReactDataGrid__column-header__resize-wrapper--first-in-section {
        border-left: 3px solid transparent
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-end-wrapper--direction-ltr .InovuaReactDataGrid__column-header--show-border-left.InovuaReactDataGrid__column-header--locked-end.InovuaReactDataGrid__column-header--first-in-section.InovuaReactDataGrid__column-header__resize-wrapper--dragging, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-end-wrapper--direction-ltr .InovuaReactDataGrid__column-header__resize-wrapper--show-border-left.InovuaReactDataGrid__column-header__resize-wrapper--locked-end.InovuaReactDataGrid__column-header__resize-wrapper--first-in-section.InovuaReactDataGrid__column-header__resize-wrapper--dragging {
        border-left: 0
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-end-wrapper--direction-ltr .InovuaReactDataGrid__column-header--show-border-left.InovuaReactDataGrid__column-header--locked-end.InovuaReactDataGrid__column-header--first-in-section:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-end-wrapper--direction-ltr .InovuaReactDataGrid__column-header__resize-wrapper--show-border-left.InovuaReactDataGrid__column-header__resize-wrapper--locked-end.InovuaReactDataGrid__column-header__resize-wrapper--first-in-section:after {
        content: "";
        position: absolute;
        left: -3px;
        z-index: 1;
        top: 0;
        bottom: 0;
        width: 3px;
        border-left: 1px solid #4f575f;
        border-right: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-end-wrapper--direction-rtl .InovuaReactDataGrid__column-header--show-border-right.InovuaReactDataGrid__column-header--locked-end.InovuaReactDataGrid__column-header--first-in-section, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-end-wrapper--direction-rtl .InovuaReactDataGrid__column-header__resize-wrapper--show-border-right.InovuaReactDataGrid__column-header__resize-wrapper--locked-end.InovuaReactDataGrid__column-header__resize-wrapper--first-in-section {
        border-right: 2px solid transparent
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-end-wrapper--direction-rtl .InovuaReactDataGrid__column-header--show-border-right.InovuaReactDataGrid__column-header--locked-end.InovuaReactDataGrid__column-header--first-in-section.InovuaReactDataGrid__column-header__resize-wrapper--dragging, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-end-wrapper--direction-rtl .InovuaReactDataGrid__column-header__resize-wrapper--show-border-right.InovuaReactDataGrid__column-header__resize-wrapper--locked-end.InovuaReactDataGrid__column-header__resize-wrapper--first-in-section.InovuaReactDataGrid__column-header__resize-wrapper--dragging {
        border-left: 0
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-end-wrapper--direction-rtl .InovuaReactDataGrid__column-header--show-border-right.InovuaReactDataGrid__column-header--locked-end.InovuaReactDataGrid__column-header--first-in-section:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-end-wrapper--direction-rtl .InovuaReactDataGrid__column-header__resize-wrapper--show-border-right.InovuaReactDataGrid__column-header__resize-wrapper--locked-end.InovuaReactDataGrid__column-header__resize-wrapper--first-in-section:after {
        content: "";
        position: absolute;
        right: -2px;
        z-index: 1;
        top: 0;
        bottom: 0;
        width: 3px;
        border-left: 1px solid #4f575f;
        border-right: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__resize-wrapper--dragging.InovuaReactDataGrid__drag-proxy.InovuaReactDataGrid__column-header__resize-wrapper--first-in-section.InovuaReactDataGrid__column-header__resize-wrapper--locked-end {
        border-left: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__resize-wrapper--dragging.InovuaReactDataGrid__drag-proxy:after {
        display: none
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header--sortable {
        -ms-user-select: none;
        user-select: none;
        -webkit-user-select: none;
        cursor: pointer
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-reorder-placeholder .InovuaReactDataGrid__column-header, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-reorder-placeholder .InovuaReactDataGrid__header-group__title {
        background: rgba(49, 57, 67, .6)
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-reorder-placeholder .InovuaReactDataGrid__column-header--dragging {
        background: rgba(60, 70, 82, .8);
        z-index: 1000;
        border-right: 1px solid #4f575f;
        border-left: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-reorder-placeholder .InovuaReactDataGrid__column-header--should-group {
        border-top: 1px solid #4f575f;
        border-bottom: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-reorder-arrow-fill {
        background: #8bb58d;
        position: absolute;
        width: auto;
        height: auto;
        top: 1px;
        bottom: 2px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-reorder-arrow-fill--direction-ltr {
        left: 2px;
        right: -2px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-reorder-arrow-fill--direction-rtl {
        right: 2px;
        left: -2px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-reorder-arrow-fill--target-group {
        top: 0;
        bottom: 1px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header--last-in-section.InovuaReactDataGrid__column-header--locked-start .InovuaReactDataGrid__column-header__content {
        padding-right: 13px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__resize-wrapper--locked:after {
        background: #616b75
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--first .InovuaReactDataGrid__cell {
        border-top: 1px solid transparent !important
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--collapsed .InovuaReactDataGrid__cell:not(.InovuaReactDataGrid__cell--show-border-bottom) {
        border-bottom: 1px solid transparent
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-rows-container--show-border-right {
        border-right: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--show-border-top {
        border-top: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--show-border-bottom, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell--show-border-bottom, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell--show-border-bottom {
        border-bottom: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--show-border-left, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell--show-border-left, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell--show-border-left {
        border-left: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--show-border-left.InovuaReactDataGrid__cell--direction-ltr.InovuaReactDataGrid__cell--locked-end:first-child:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell--show-border-left.InovuaReactDataGrid__footer-row-cell--direction-ltr.InovuaReactDataGrid__footer-row-cell--locked-end:first-child:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell--show-border-left.InovuaReactDataGrid__locked-row-cell--direction-ltr.InovuaReactDataGrid__locked-row-cell--locked-end:first-child:after {
        content: "";
        position: absolute;
        left: -1px;
        top: -1px;
        bottom: -1px;
        width: 3px;
        border-left: 1px solid #4f575f;
        border-right: 1px solid #4f575f;
        background: #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--show-border-right.InovuaReactDataGrid__cell--direction-rtl.InovuaReactDataGrid__cell--last, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--show-border-right:not(.InovuaReactDataGrid__cell--last), .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell--show-border-right:not(.InovuaReactDataGrid__footer-row-cell--last), .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell--show-border-right:not(.InovuaReactDataGrid__locked-row-cell--last) {
        border-right: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--show-border-right.InovuaReactDataGrid__cell--direction-rtl.InovuaReactDataGrid__cell--locked-end.InovuaReactDataGrid__cell--first-in-section, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--show-border-right.InovuaReactDataGrid__cell--direction-rtl.InovuaReactDataGrid__cell--locked-end.InovuaReactDataGrid__footer-row-cell--first-in-section, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--show-border-right.InovuaReactDataGrid__cell--direction-rtl.InovuaReactDataGrid__cell--locked-end.InovuaReactDataGrid__locked-row-cell--first-in-section, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell--show-border-right.InovuaReactDataGrid__footer-row-cell--direction-rtl.InovuaReactDataGrid__footer-row-cell--locked-end.InovuaReactDataGrid__cell--first-in-section, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell--show-border-right.InovuaReactDataGrid__footer-row-cell--direction-rtl.InovuaReactDataGrid__footer-row-cell--locked-end.InovuaReactDataGrid__footer-row-cell--first-in-section, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell--show-border-right.InovuaReactDataGrid__footer-row-cell--direction-rtl.InovuaReactDataGrid__footer-row-cell--locked-end.InovuaReactDataGrid__locked-row-cell--first-in-section, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell--show-border-right.InovuaReactDataGrid__locked-row-cell--direction-rtl.InovuaReactDataGrid__locked-row-cell--locked-end.InovuaReactDataGrid__cell--first-in-section, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell--show-border-right.InovuaReactDataGrid__locked-row-cell--direction-rtl.InovuaReactDataGrid__locked-row-cell--locked-end.InovuaReactDataGrid__footer-row-cell--first-in-section, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell--show-border-right.InovuaReactDataGrid__locked-row-cell--direction-rtl.InovuaReactDataGrid__locked-row-cell--locked-end.InovuaReactDataGrid__locked-row-cell--first-in-section {
        border-right: none
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--show-border-right.InovuaReactDataGrid__cell--direction-rtl.InovuaReactDataGrid__cell--locked-end.InovuaReactDataGrid__cell--last-in-section:not(.InovuaReactDataGrid__cell--first-in-section), .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--show-border-right.InovuaReactDataGrid__cell--direction-rtl.InovuaReactDataGrid__cell--locked-end.InovuaReactDataGrid__footer-row-cell--last-in-section:not(.InovuaReactDataGrid__footer-row-cell--first-in-section), .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--show-border-right.InovuaReactDataGrid__cell--direction-rtl.InovuaReactDataGrid__cell--locked-end.InovuaReactDataGrid__locked-row-cell--last-in-section:not(.InovuaReactDataGrid__locked-row-cell--first-in-section), .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell--show-border-right.InovuaReactDataGrid__footer-row-cell--direction-rtl.InovuaReactDataGrid__footer-row-cell--locked-end.InovuaReactDataGrid__cell--last-in-section:not(.InovuaReactDataGrid__cell--first-in-section), .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell--show-border-right.InovuaReactDataGrid__footer-row-cell--direction-rtl.InovuaReactDataGrid__footer-row-cell--locked-end.InovuaReactDataGrid__footer-row-cell--last-in-section:not(.InovuaReactDataGrid__footer-row-cell--first-in-section), .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell--show-border-right.InovuaReactDataGrid__footer-row-cell--direction-rtl.InovuaReactDataGrid__footer-row-cell--locked-end.InovuaReactDataGrid__locked-row-cell--last-in-section:not(.InovuaReactDataGrid__locked-row-cell--first-in-section), .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell--show-border-right.InovuaReactDataGrid__locked-row-cell--direction-rtl.InovuaReactDataGrid__locked-row-cell--locked-end.InovuaReactDataGrid__cell--last-in-section:not(.InovuaReactDataGrid__cell--first-in-section), .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell--show-border-right.InovuaReactDataGrid__locked-row-cell--direction-rtl.InovuaReactDataGrid__locked-row-cell--locked-end.InovuaReactDataGrid__footer-row-cell--last-in-section:not(.InovuaReactDataGrid__footer-row-cell--first-in-section), .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell--show-border-right.InovuaReactDataGrid__locked-row-cell--direction-rtl.InovuaReactDataGrid__locked-row-cell--locked-end.InovuaReactDataGrid__locked-row-cell--last-in-section:not(.InovuaReactDataGrid__locked-row-cell--first-in-section) {
        border-right: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--show-border-right.InovuaReactDataGrid__cell--direction-rtl.InovuaReactDataGrid__cell--locked-end:first-child:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell--show-border-right.InovuaReactDataGrid__footer-row-cell--direction-rtl.InovuaReactDataGrid__footer-row-cell--locked-end:first-child:after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell--show-border-right.InovuaReactDataGrid__locked-row-cell--direction-rtl.InovuaReactDataGrid__locked-row-cell--locked-end:first-child:after {
        content: "";
        position: absolute;
        right: 0;
        top: -1px;
        bottom: -1px;
        width: 3px;
        border-left: 1px solid #4f575f;
        border-right: 1px solid #4f575f;
        background: #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--direction-ltr.InovuaReactDataGrid__cell--show-border-right.InovuaReactDataGrid__cell--locked-start.InovuaReactDataGrid__cell--last-in-section:not(.InovuaReactDataGrid__cell--last):after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell--direction-ltr.InovuaReactDataGrid__footer-row-cell--show-border-right.InovuaReactDataGrid__footer-row-cell--locked-start.InovuaReactDataGrid__footer-row-cell--last-in-section:not(.InovuaReactDataGrid__footer-row-cell--last):after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell--direction-ltr.InovuaReactDataGrid__locked-row-cell--show-border-right.InovuaReactDataGrid__locked-row-cell--locked-start.InovuaReactDataGrid__locked-row-cell--last-in-section:not(.InovuaReactDataGrid__locked-row-cell--last):after {
        content: "";
        position: absolute;
        right: -1px;
        top: -1px;
        bottom: -1px;
        width: 3px;
        border-left: 1px solid #4f575f;
        border-right: 1px solid #4f575f;
        background: #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--direction-rtl.InovuaReactDataGrid__cell--show-border-left.InovuaReactDataGrid__cell--locked-start.InovuaReactDataGrid__cell--last-in-section:not(.InovuaReactDataGrid__cell--last):after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell--direction-rtl.InovuaReactDataGrid__footer-row-cell--show-border-left.InovuaReactDataGrid__footer-row-cell--locked-start.InovuaReactDataGrid__footer-row-cell--last-in-section:not(.InovuaReactDataGrid__footer-row-cell--last):after, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell--direction-rtl.InovuaReactDataGrid__locked-row-cell--show-border-left.InovuaReactDataGrid__locked-row-cell--locked-start.InovuaReactDataGrid__locked-row-cell--last-in-section:not(.InovuaReactDataGrid__locked-row-cell--last):after {
        content: "";
        position: absolute;
        left: -1px;
        top: -1px;
        bottom: -1px;
        width: 3px;
        border-left: 1px solid #4f575f;
        border-right: 1px solid #4f575f;
        background: #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--show-border-right.InovuaReactDataGrid__cell--last-in-section.InovuaReactDataGrid__cell--locked-start, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell--show-border-right.InovuaReactDataGrid__footer-row-cell--last-in-section.InovuaReactDataGrid__footer-row-cell--locked-start, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell--show-border-right.InovuaReactDataGrid__locked-row-cell--last-in-section.InovuaReactDataGrid__locked-row-cell--locked-start {
        padding-right: 13px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--direction-ltr.InovuaReactDataGrid__cell--show-border-left.InovuaReactDataGrid__cell--first-in-section.InovuaReactDataGrid__cell--locked-end, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell--direction-ltr.InovuaReactDataGrid__footer-row-cell--show-border-left.InovuaReactDataGrid__footer-row-cell--first-in-section.InovuaReactDataGrid__footer-row-cell--locked-end, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell--direction-ltr.InovuaReactDataGrid__locked-row-cell--show-border-left.InovuaReactDataGrid__locked-row-cell--first-in-section.InovuaReactDataGrid__locked-row-cell--locked-end {
        padding-left: 13px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--direction-rtl.InovuaReactDataGrid__cell--show-border-left.InovuaReactDataGrid__cell--first-in-section.InovuaReactDataGrid__cell--locked-end, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__footer-row-cell--direction-rtl.InovuaReactDataGrid__footer-row-cell--show-border-right.InovuaReactDataGrid__footer-row-cell--first-in-section.InovuaReactDataGrid__footer-row-cell--locked-end, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__locked-row-cell--direction-rtl.InovuaReactDataGrid__locked-row-cell--show-border-right.InovuaReactDataGrid__locked-row-cell--first-in-section.InovuaReactDataGrid__locked-row-cell--locked-end {
        padding-right: 13px
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-border-right.InovuaReactDataGrid--direction-ltr .InovuaReactDataGrid__cell--last:not(.InovuaReactDataGrid__cell--hidden), .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-border-right.InovuaReactDataGrid--direction-ltr .InovuaReactDataGrid__footer-row-cell--last:not(.InovuaReactDataGrid__cell--hidden), .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-border-right.InovuaReactDataGrid--direction-ltr .InovuaReactDataGrid__locked-row-cell--last:not(.InovuaReactDataGrid__cell--hidden), .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-border-right.InovuaReactDataGrid--direction-ltr .InovuaReactDataGrid__row-details.InovuaReactDataGrid__row-details--show-border-right:not(.InovuaReactDataGrid__row-details--min-viewport-width) {
        border-right: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-border-right.InovuaReactDataGrid--direction-rtl .InovuaReactDataGrid__cell--last:not(.InovuaReactDataGrid__cell--hidden), .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-border-right.InovuaReactDataGrid--direction-rtl .InovuaReactDataGrid__footer-row-cell--last:not(.InovuaReactDataGrid__cell--hidden), .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-border-right.InovuaReactDataGrid--direction-rtl .InovuaReactDataGrid__locked-row-cell--last:not(.InovuaReactDataGrid__cell--hidden), .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--show-border-right.InovuaReactDataGrid--direction-rtl .InovuaReactDataGrid__row-details.InovuaReactDataGrid__row-details--show-border-right:not(.InovuaReactDataGrid__row-details--min-viewport-width) {
        border-left: 1px solid #4f575f
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--hidden {
        border-right: 0;
        border-left: 0
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--first .InovuaReactDataGrid__cell.InovuaReactDataGrid__cell, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--first .InovuaReactDataGrid__nested-block, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--first .InovuaReactDataGrid__nested-cell, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row--first .InovuaReactDataGrid__nested-group-cell {
        border-top: 0
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--no-background.InovuaReactDataGrid__cell--no-background {
        background: #313943
      }

      .InovuaReactDataGrid--theme-green-dark.InovuaReactDataGrid--grouped .InovuaReactDataGrid__cell--first-in-column-group {
        padding: 0;
        flex: 1
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--group-cell:not(.InovuaReactDataGrid__cell--pivot-enabled) {
        background: #313943;
        font-weight: 700
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--group-expand-cell.InovuaReactDataGrid__cell--group-expand-cell {
        padding: 0
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__nested-cell, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__nested-group-cell {
        height: auto
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell.InovuaReactDataGrid__cell--locked:after {
        background: #616b75
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__virtual-list-sticky-rows-container .InovuaReactDataGrid__row-cell-wrap .InovuaReactDataGrid__cell.InovuaReactDataGrid__cell--show-border-top {
        border-top: 1px solid transparent
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--last-in-section.InovuaReactDataGrid__cell--locked-start .InovuaReactDataGrid__cell__selection {
        right: 3px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--last-in-section.InovuaReactDataGrid__cell--locked-start .InovuaReactDataGrid__cell__selection-dragger {
        right: 1px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--last-in-section.InovuaReactDataGrid__cell--unlocked .InovuaReactDataGrid__cell__selection {
        right: 0
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--first-in-section.InovuaReactDataGrid__cell--locked-end .InovuaReactDataGrid__cell__selection {
        left: 3px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--first-in-section.InovuaReactDataGrid__cell--locked-end .InovuaReactDataGrid__cell__selection-dragger {
        right: 1px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--first-in-section.InovuaReactDataGrid__cell--locked-end .InovuaReactDataGrid__cell__selection-dragger--direction-rtl {
        left: 1px;
        right: unset
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--last-in-section .InovuaReactDataGrid__cell__selection-dragger {
        right: 1px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--last-in-section .InovuaReactDataGrid__cell__selection-dragger--direction-rtl {
        left: 1px;
        right: unset
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--cell-active .InovuaReactDataGrid__cell__selection:after {
        border: 2px solid #8bb58d
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--cell-selected .InovuaReactDataGrid__cell__selection:after {
        background: rgba(139, 181, 141, .15)
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--cell-active.InovuaReactDataGrid__cell--cell-selected {
        color: #c5cae9
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell--cell-active.InovuaReactDataGrid__cell--cell-selected .InovuaReactDataGrid__cell__selection:after {
        border: 2px solid #8bb58d
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell__selection {
        background: rgba(139, 181, 141, .05)
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell__selection:after {
        border: 1px solid #8bb58d
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__cell__selection-dragger {
        border-top: none;
        border-left: none;
        width: 6px;
        height: 6px;
        background: #8bb58d
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__filter-wrapper {
        min-height: 41px;
        border: 0;
        background: #313943;
        border-top: 1px solid #4f575f;
        padding: 4px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__filter-wrapper--disabled, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__filter-wrapper--read-only {
        opacity: .6
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__filter-wrapper .InovuaReactDataGrid__column-header__filter {
        min-height: 32px;
        max-height: 32px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__filter__binary_operator_separator {
        width: 4px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__filter-settings {
        margin-left: 8px;
        margin-right: 4px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__filter-settings svg {
        pointer-events: none;
        transform: translateY(0);
        transition: transform .2s
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__filter-settings:active svg {
        transform: translateY(1px)
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__filter-settings .InovuaReactDataGrid__column-header__filter-settings-icon {
        fill: #9ba7b4
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__filter-settings:hover .InovuaReactDataGrid__column-header__filter-settings-icon {
        fill: #e8e8e8
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__header-wrapper__fill__filters {
        min-height: 41px;
        border-top: 1px solid #4f575f;
        background: #313943
      }

      .InovuaReactDataGrid__group-toolbar--theme-green-dark {
        padding: 4px;
        border-bottom: 1px solid #4f575f;
        background: #313943;
        fill: #9ba7b4;
        min-height: 40px
      }

      .InovuaReactDataGrid__group-toolbar--theme-green-dark .InovuaReactDataGrid__group-toolbar-insert-arrow {
        background: #9ba7b4;
        margin: 0 3px
      }

      .InovuaReactDataGrid__group-toolbar--theme-green-dark .InovuaReactDataGrid__group-toolbar-insert-arrow:first-child {
        margin-left: 0
      }

      .InovuaReactDataGrid__group-toolbar-item--theme-green-dark {
        padding: 8px 9px;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        border: 1px solid #4f575f;
        background: #313943;
        cursor: move;
        cursor: grabbing
      }

      .InovuaReactDataGrid__group-toolbar-item--theme-green-dark.InovuaReactDataGrid__group-toolbar-item--sortable {
        cursor: pointer
      }

      .InovuaReactDataGrid__group-toolbar-item--theme-green-dark.InovuaReactDataGrid__group-toolbar-item--dragging {
        opacity: .8;
        cursor: move;
        cursor: grabbing
      }

      .InovuaReactDataGrid__group-toolbar-item--theme-green-dark:not(.InovuaReactDataGrid__group-toolbar-item--dragging) {
        transition: left .2s
      }

      .InovuaReactDataGrid__group-toolbar-item--theme-green-dark.InovuaReactDataGrid__group-toolbar-item--placeholder {
        border: 1px solid transparent;
        opacity: .9
      }

      .InovuaReactDataGrid__group-toolbar-item--theme-green-dark .InovuaReactDataGrid__group-toolbar-item__clear-icon {
        vertical-align: middle;
        cursor: pointer;
        position: relative;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none
      }

      .InovuaReactDataGrid__group-toolbar-item--theme-green-dark .InovuaReactDataGrid__group-toolbar-item__clear-icon svg {
        margin-bottom: 2px;
        transform: translateY(0);
        transition: transform .2s;
        pointer-events: none;
        stroke: #9ba7b4
      }

      .InovuaReactDataGrid__group-toolbar-item--theme-green-dark .InovuaReactDataGrid__group-toolbar-item__clear-icon:active svg {
        transform: translateY(1px)
      }

      .InovuaReactDataGrid__group-toolbar--direction-ltr .InovuaReactDataGrid__group-toolbar-item--theme-green-dark + .InovuaReactDataGrid__group-toolbar-item--theme-green-dark {
        margin-left: 2px
      }

      .InovuaReactDataGrid__group-toolbar--direction-rtl .InovuaReactDataGrid__group-toolbar-item--theme-green-dark + .InovuaReactDataGrid__group-toolbar-item--theme-green-dark {
        margin-right: 2px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-active-borders-inner {
        border: 2px solid #8bb58d;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        pointer-events: none
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-active-borders {
        position: absolute;
        right: 0;
        bottom: 0;
        top: 0;
        left: 0;
        pointer-events: none
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-active-borders--has-border-top .InovuaReactDataGrid__row-active-borders-inner {
        top: 0
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__row-active-borders--has-border-bottom .InovuaReactDataGrid__row-active-borders-inner {
        bottom: 0
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__menu-tool {
        border-left: none;
        border-right: none;
        margin-right: 8px;
        padding: 1px
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__menu-tool svg {
        transform: translateY(0);
        pointer-events: none;
        transition: transform .2s
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__menu-tool svg:active {
        transform: translateY(1px)
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header__menu-tool:hover svg {
        fill: #e8e8e8
      }

      .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header--align-end.InovuaReactDataGrid__column-header--direction-ltr > .InovuaReactDataGrid__column-header__menu-tool, .InovuaReactDataGrid--theme-green-dark .InovuaReactDataGrid__column-header--align-start.InovuaReactDataGrid__column-header--direction-rtl > .InovuaReactDataGrid__column-header__menu-tool {
        border-left: none;
        border-right: none;
        margin-left: 8px
      }
    `;
    return scss;
}
