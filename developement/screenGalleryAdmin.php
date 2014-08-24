<?php

include 'class.adminTab.php';

$tabs = array(
	'Overview',
	'Galleries',
	'Tags',
	'Style'
);

$tabs = new AdminTabs($tabs);

?>

<div class="adminArea">
	<nav class="tabs">
		<?php $tabs->buildTabs(); ?>
	</nav>

	<div class="adminContent">
		<?php $tabs->assignContent(); ?>
	</div>
</div>