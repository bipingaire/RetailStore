const fs = require('fs');
const file = 'app/super-admin/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove the extra div before the modal
content = content.replace('</main>\r\n      </div> {/* end inner wrapper */}\r\n\r\n      {/* Edit Product Modal */}', '</main>\r\n\r\n      {/* Edit Product Modal */}');
content = content.replace('</main>\n      </div> {/* end inner wrapper */}\n\n      {/* Edit Product Modal */}', '</main>\n\n      {/* Edit Product Modal */}');

// Add the closing div at the end of the file
content = content.replace('      )}\r\n      \r\n  );\r\n}', '      )}\r\n    </div>\r\n  );\r\n}');
content = content.replace('      )}\n      \n  );\n}', '      )}\n    </div>\n  );\n}');

fs.writeFileSync(file, content);
