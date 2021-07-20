/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const { SourceNode } = require("source-map");
const { SourceListMap, fromStringWithSourceMap } = require("source-list-map");
const sourceMapToSourceNode = require("./helpers/sourceMapToSourceNode");

exports.getSourceAndMap = (inputSource, options) => {
	let source;
	let map;
	if (options && options.columns === false) {
		const res = inputSource.listMap(options).toStringWithSourceMap({
			file: "x"
		});
		source = res.source;
		map = res.map;
	} else {
		const res = inputSource.node(options).toStringWithSourceMap({
			file: "x"
		});
		source = res.code;
		map = res.map.toJSON();
	}
	if (!map || !map.sources || map.sources.length === 0) map = null;

	return {
		source,
		map
	};
};

exports.getMap = (source, options) => {
	let map;
	if (options && options.columns === false) {
		map = source.listMap(options).toStringWithSourceMap({
			file: "x"
		}).map;
	} else {
		map = source
			.node(options)
			.toStringWithSourceMap({
				file: "x"
			})
			.map.toJSON();
	}
	if (!map || !map.sources || map.sources.length === 0) return null;
	return map;
};

exports.getNode = (source, options) => {
	if (typeof source.node === "function") {
		return source.node(options);
	} else {
		const sourceAndMap = source.sourceAndMap(options);
		if (sourceAndMap.map) {
			return sourceMapToSourceNode(sourceAndMap.source, sourceAndMap.map);
		} else {
			return new SourceNode(null, null, null, sourceAndMap.source);
		}
	}
};

exports.getListMap = (source, options) => {
	if (typeof source.listMap === "function") {
		return source.listMap(options);
	} else {
		const sourceAndMap = source.sourceAndMap(options);
		if (sourceAndMap.map) {
			return fromStringWithSourceMap(sourceAndMap.source, sourceAndMap.map);
		} else {
			return new SourceListMap(sourceAndMap.source);
		}
	}
};
