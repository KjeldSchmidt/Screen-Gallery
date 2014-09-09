<?php

class AdminTabs {

	public $currentTab;
	public $tabs = array();


	function __construct($tabs) {
		foreach ($tabs as $key => $value) {
			$tab = new Tab($value);
			$this->tabs[] = $tab;

			if (isset($_GET['adminOptionTab'])) {
				if ($tab->slug === $_GET['adminOptionTab']) $this->currentTab = $tab;
			}
		}

		if (!isset($this->currentTab)) $this->currentTab = $this->tabs[0];
	}

	function buildTabs() {
		foreach ($this->tabs as $key => $value) {

			$link = add_query_arg(array('adminOptionTab'=>$value->slug)); ?>

			<div class="adminTabs<?php if ($this->currentTab === $value) echo " active"; ?>">
				<a href="<?php echo $link; ?>">
					<?php echo $value->name; ?>
				</a>
			</div> <?php
		}

		wp_register_style('adminTabsStyle', plugins_url('css/adminTabsStyle.css', __FILE__));
		wp_enqueue_style('adminTabsStyle');
	}

	function assignContent() {
		$url = "adminTabs/" . $this->currentTab->file;
		if (!(include $url) == 'OK') echo $url . " could not be included. Please check file name, location and adminTabs configuration.";
	}
}

class Tab {
	
	public $name;
	public $slug;
	public $file;


	function __construct($tabBasis) {
		if (is_array($tabBasis)) {
			if (isset($tabBasis[0]))	$this->name = $tabBasis[0];
			if (isset($tabBasis[1]))	$this->slug = $tabBasis[1];
			if (isset($tabBasis[2]))	$this->file = $tabBasis[2];

			if (!isset($this->slug))	guessFromName($this->name);

			if (!isset($this->file))	$this->file = $this->slug;

		} else $this->guessFromName($tabBasis);
	}

	function guessFromName($name) {
		$this->name	= $name;
		$this->slug	= $this->makeSlug($name);
		$this->file = $this->slug . '.php';
	}

	function makeSlug($text) {
		$text = preg_replace('~[^\\pL\d]+~u', '-', $text);
		$text = trim($text, '-');
		$text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
		$text = strtolower($text);
		$text = preg_replace('~[^-\w]+~', '', $text);

		if (empty($text)) {	return 'n-a'; }

  		return $text;
	}	
}

?>