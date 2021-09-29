import React, {FC, ReactElement, useState} from 'react';
import './SessionPage.scss';

export const SessionPage: FC = (props): ReactElement => {
    return (
        <div>
            <div className="page">
                {/* Markdown page */}
                <div id="document-page" className="box">
                    <article id="documentation-content" className="markdown-body"/>
                </div>
                {/* SQL Workbench */}
                <main className="workbench">
                    <div className="panel">
                        <textarea className="box" id="editor"/>
                        <textarea className="box" id="interface"/>
                    </div>
                </main>
            </div>
            <div className="toast-container" id="notifications"/>
        </div>
    );
}

const SessionNav: FC = (props): ReactElement => {
    return (
        <div className={"body"}>
            <nav className="navbar navbar-expand-lg navbar-dark">
                <div className="container-fluid">
                    <BrandIdentifier/>

                    <button className="navbar-toggler shadow-none border-none" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M17 14C17.5523 14 18 14.4477 18 15C18 15.5523 17.5523 16 17 16H3C2.44772 16 2 15.5523 2 15C2 14.4477 2.44772 14 3 14H17ZM17 9C17.5523 9 18 9.44772 18 10C18 10.5523 17.5523 11 17 11H3C2.44772 11 2 10.5523 2 10C2 9.44772 2.44772 9 3 9H17ZM17 4C17.5523 4 18 4.44772 18 5C18 5.55228 17.5523 6 17 6H3C2.44772 6 2 5.55228 2 5C2 4.44772 2.44772 4 3 4H17Z"
                                  fill="white"/>
                        </svg>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle text-nowrap" href="#" id="navbarDropdown"
                                   role="button"
                                   data-bs-toggle="dropdown" aria-expanded="false">
                                    Resources
                                </a>

                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <h6 className="dropdown-header">SQL Lessons</h6>
                                    <li><a className="dropdown-item" href="#"><b>1.</b> Create tables</a></li>
                                    <li><a className="dropdown-item" href="#"><b>2.</b> Insert data into tables</a></li>
                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>
                                    <h6 className="dropdown-header">Learn SQL</h6>
                                    <li><a className="dropdown-item" target="_blank" href="https://w3schools.com/sql/">W3Schools
                                        SQL
                                        Tutorial</a></li>
                                    <li><a className="dropdown-item" target="_blank"
                                           href="https://www.codecademy.com/articles/sql-commands">Commonly used SQL
                                        commands</a></li>
                                </ul>

                                <div className="btn-toolbar gap-3" role="toolbar"
                                     aria-label="Toolbar with button groups">

                                    <div className="form-check form-switch text-nowrap align-self-center me-5"
                                         id="submitCtrlSwitch">

                                        <input className="form-check-input" type="checkbox" id="submitOnCtrlEnter"/>
                                        <label className="form-check-label text-secondary"
                                               htmlFor="submitOnCtrlEnter">Submit on ctrl +
                                            enter</label>

                                        <InputModeRadioGroup/>
                                        <Toolbar/>
                                        <CloseButton/>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

const BrandIdentifier: FC = (props): ReactElement => {
    return (
        <div className="brand-identifier">
            <img className="brand-logo" src="assets/img/basic_icon.png" alt={"SQL Editor Logo"}>
                <a className="navbar-brand" href="#">SQL Editor</a>
            </img>
        </div>
    );
}

const InputModeRadioGroup: FC = (props): ReactElement => {
    return (
        <div className="btn-group me-2" role="group"
             aria-label="Basic radio toggle button group"
             id="interface-mode">
            <input type="radio" className="btn-check" name="btnradio"
                   id="interface-mode-update" autoComplete="off"/>
            <label className="btn btn-outline-primary"
                   htmlFor="interface-mode-update">Update</label>

            <input type="radio" className="btn-check" name="btnradio"
                   id="interface-mode-query" autoComplete="off" checked/>
            <label className="btn btn-outline-primary"
                   htmlFor="interface-mode-query">Query</label>

            <input type="radio" className="btn-check" name="btnradio"
                   id="interface-mode-system" autoComplete="off"/>
            <label className="btn btn-outline-primary"
                   htmlFor="interface-mode-system">System</label>

        </div>
    );
}

const Toolbar: FC = (props): ReactElement => {
    return (
        <div className="btn-group me-2" role="group" aria-label="Second group">
            <button type="button" id="loadCachedSQLLast"
                    className="btn btn-outline-primary rich-btn">
                <svg className="icon-20 btn-icon-secondary" width="20" height="20"
                     viewBox="0 0 24 24"
                     fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M16 21C15.744 21 15.488 20.902 15.293 20.707L7.29301 12.707C6.90201 12.316 6.90201 11.684 7.29301 11.293L15.293 3.29301C15.684 2.90201 16.316 2.90201 16.707 3.29301C17.098 3.68401 17.098 4.31601 16.707 4.70701L9.41401 12L16.707 19.293C17.098 19.684 17.098 20.316 16.707 20.707C16.512 20.902 16.256 21 16 21Z"/>
                </svg>

            </button>
            <button type="button" id="loadCachedSQLNext"
                    className="btn btn-outline-primary rich-btn">
                <svg className="icon-20 btn-icon-secondary" width="20" height="20"
                     viewBox="0 0 24 24"
                     fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M7.99999 21C8.25599 21 8.51199 20.902 8.70699 20.707L16.707 12.707C17.098 12.316 17.098 11.684 16.707 11.293L8.70699 3.29301C8.31599 2.90201 7.68399 2.90201 7.29299 3.29301C6.90199 3.68401 6.90199 4.31601 7.29299 4.70701L14.586 12L7.29299 19.293C6.90199 19.684 6.90199 20.316 7.29299 20.707C7.48799 20.902 7.74399 21 7.99999 21Z"/>
                </svg>
            </button>

            <button type="button" id="openDocumentation"
                    className="btn btn-outline-primary rich-btn">
                <svg className="icon-20 btn-icon-secondary" width="20" height="20"
                     viewBox="0 0 24 24"
                     fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14 2C14.2652 2 14.5196 2.10536 14.7071 2.29289L19.7071 7.29289C19.8946 7.48043 20 7.73478 20 8V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V5C4 3.34315 5.34315 2 7 2H14ZM11.999 4H7C6.44772 4 6 4.44772 6 5V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V10H13C12.4872 10 12.0645 9.61396 12.0067 9.11662L12 9L11.999 4ZM17.586 8L13.999 4.414L14 8H17.586Z"/>
                </svg>
            </button>

            <button type="button" id="openSettings"
                    className="btn btn-outline-primary rich-btn">
                <svg className="icon-20 btn-icon-secondary" width="20" height="20"
                     viewBox="0 0 20 20"
                     fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9.22673 2L10.792 2.00092C10.8513 2.00374 10.9206 2.01157 10.996 2.02798L11.1691 2.07097C11.5713 2.18771 11.7606 2.3983 12.1292 3.25077L12.2871 3.62729L12.451 4.03345L12.8342 3.86293C13.5976 3.5299 13.9434 3.42718 14.2162 3.42718C14.4976 3.42718 14.7823 3.52607 15.0015 3.69975L15.1053 3.79271L16.162 4.84498L16.3131 5.00911C16.5965 5.34082 16.6592 5.6034 16.4605 6.23104L16.3501 6.54822L16.2017 6.92673L15.9559 7.51329L16.5451 7.73561C17.4648 8.09429 17.7359 8.28039 17.8846 8.65252L17.9112 8.72456L17.9589 8.88382C17.983 8.97411 17.9932 9.03819 17.9974 9.10962L18 9.22647V10.7103C18 10.8339 17.9957 10.9055 17.9638 11.0333C17.8364 11.5449 17.6948 11.7264 16.7372 12.1393L16.5479 12.2196L15.9705 12.4545L16.1501 12.8493C16.699 14.0756 16.7553 14.4343 16.4201 14.8678L16.3669 14.9335L16.2432 15.0712L15.1562 16.1575C14.9192 16.3971 14.5856 16.5274 14.2606 16.5274C14.0898 16.5274 13.8749 16.4815 13.5706 16.3792L13.4107 16.3234L13.0414 16.1822L12.4851 15.9527L12.3291 16.3681C11.9164 17.4488 11.7331 17.738 11.3315 17.8915L11.2583 17.9173L11.1043 17.9615C11.0169 17.9841 10.955 17.9937 10.8862 17.9975L10.7735 18L9.20804 17.9991C9.14892 17.9963 9.0799 17.9885 9.00474 17.9722C8.54231 17.872 8.34049 17.7504 8.01586 17.071L7.94428 16.9167L7.78648 16.5521L7.548 15.9666L7.16457 16.1371C6.40086 16.47 6.05525 16.5726 5.78293 16.5726C5.50495 16.5726 5.22404 16.4758 4.99889 16.3004L4.89124 16.2062L3.80292 15.1181C3.39492 14.6856 3.29446 14.454 3.58402 13.6276L3.64716 13.4541L3.79474 13.0796L4.04309 12.488L3.63394 12.3344C2.56805 11.9272 2.27115 11.7406 2.11385 11.3438L2.08741 11.2715L2.04015 11.1117C2.01662 11.0224 2.00662 10.959 2.00257 10.8884L2 10.7728V9.28807C2 9.16346 2.00443 9.09116 2.03688 8.96228C2.14872 8.51808 2.27014 8.32367 2.93112 8.00948L3.09347 7.93468L3.45277 7.7802L4.02991 7.54625L3.85081 7.15004C3.24863 5.79456 3.24293 5.47232 3.72774 4.95938L3.79688 4.88814L4.84611 3.84129C5.08115 3.60495 5.41329 3.47332 5.73894 3.47332C5.93873 3.47332 6.19675 3.53525 6.59065 3.67775L6.768 3.7438L7.12861 3.88661L7.51564 4.04737L7.74446 3.4443C8.11371 2.50387 8.30627 2.2324 8.69908 2.09454L8.77516 2.07013L8.93507 2.02947C9.01225 2.01219 9.06675 2.00485 9.12744 2.00188L10.792 2.00092L9.22673 2ZM10.2654 4H9.68478L9.59598 4.21539L9.49017 4.4849L9.19618 5.26965C9.11261 5.49033 8.95422 5.67311 8.75061 5.78744L8.64518 5.83875L8.00809 6.10386C7.80128 6.18992 7.57287 6.20358 7.35928 6.14497L7.23321 6.10113L6.57075 5.82099L6.24104 5.68718L5.94281 5.57228L5.5309 5.98326L5.73485 6.45907L6.0825 7.22097C6.17926 7.43127 6.19949 7.66722 6.14237 7.88868L6.09881 8.01951L5.8383 8.65256C5.74962 8.86805 5.58902 9.04463 5.38569 9.15353L5.28061 9.2022L4.48631 9.52093L4.215 9.63473L4 9.7291V10.3211L4.1007 10.3632L4.48192 10.5142L5.25883 10.8036C5.48612 10.8856 5.67472 11.0465 5.79169 11.2548L5.84406 11.3628L6.1046 11.994C6.19063 12.2024 6.20322 12.4324 6.14273 12.647L6.09767 12.7735L5.76187 13.5636L5.56652 14.054L5.97824 14.4652L6.23658 14.358L6.73453 14.1392L7.20477 13.9233C7.42382 13.8187 7.6721 13.7978 7.90343 13.8621L8.01747 13.9013L8.6583 14.1659C8.8767 14.256 9.05489 14.42 9.16311 14.6273L9.21125 14.7344L9.5246 15.5138L9.7339 16H10.3168L10.405 15.7852L10.5103 15.5164L10.8036 14.732C10.8871 14.5094 11.0467 14.325 11.2521 14.2103L11.3585 14.1588L11.9966 13.8955C12.201 13.8112 12.4263 13.7974 12.6375 13.8541L12.7623 13.8967L13.2451 14.1021L13.7597 14.3135L14.0574 14.4284L14.47 14.0166L14.4286 13.9165L14.1971 13.3887L13.917 12.7794C13.8199 12.5687 13.7996 12.3323 13.857 12.1104L13.9007 11.9793L14.1608 11.349C14.249 11.1352 14.4081 10.9597 14.6095 10.8508L14.7136 10.802L15.5124 10.4801L16 10.2705V9.67935L15.8992 9.63741L15.5173 9.48681L14.7378 9.19724C14.511 9.11473 14.323 8.95356 14.2066 8.74517L14.1546 8.63719L13.8945 8.00344C13.8092 7.79556 13.7968 7.56631 13.8571 7.35247L13.902 7.22631L14.2372 6.43685L14.4323 5.94503L14.0203 5.53474L13.8981 5.58478L13.4412 5.78197L12.7801 6.08244C12.5701 6.17864 12.3348 6.19865 12.1138 6.14168L11.9833 6.09825L11.3429 5.835C11.1273 5.7464 10.9507 5.58585 10.8417 5.38255L10.793 5.27747L10.5393 4.64409L10.3603 4.21528L10.2654 4ZM10.0003 8C11.1028 8 12 8.89682 12 9.99942C12 11.102 11.1029 12 10.0003 12C8.89731 12 8 11.1022 8 9.99942C8 8.89663 8.89734 8 10.0003 8Z"/>
                </svg>
            </button>

            <button type="button" id="clearOutput"
                    className="btn btn-outline-primary rich-btn">
                <svg className="icon-20 btn-icon-secondary" width="20" height="20"
                     viewBox="0 0 20 20"
                     fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15 8C15.5523 8 16 8.44772 16 9V15C16 16.6569 14.6569 18 13 18H7C5.34315 18 4 16.6569 4 15V9C4 8.44772 4.44772 8 5 8H15ZM14 10H6V15C6 15.5523 6.44772 16 7 16H13C13.5523 16 14 15.5523 14 15V10ZM7 3C7 2.44772 7.44772 2 8 2H12C12.5523 2 13 2.44772 13 3V4H16C16.5523 4 17 4.44772 17 5C17 5.55228 16.5523 6 16 6H4C3.44772 6 3 5.55228 3 5C3 4.44772 3.44772 4 4 4H7V3Z"/>
                </svg>
            </button>
        </div>
    );
}

const CloseButton: FC = (props): ReactElement => {
    return (
        <div id="close-session-btn-group" className="btn-group" role="group"
             aria-label="Third group">
            <button type="button" id="close-session-btn"
                    className="btn btn-danger rich-btn">
                <p id="close-session-btn-text"/>
                <img className="close-session-btn icon-whitify icon-20"
                     src="assets/icons/ic20-turn-off.png"
                     alt="close-session"/>
            </button>
        </div>
    );
}
