/* eslint-disable no-new */
/* globals document */
import IndexApp from './index/app';
// import ConfidentialityApp from './confidentiality/app';

const page = document.body.getAttribute('data-page');

if (page === 'index') {
  new IndexApp();
} else if (page === 'confidentiality') {
  // new ConfidentialityApp();
}
