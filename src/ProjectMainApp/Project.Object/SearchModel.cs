﻿namespace Project.Object
{
    public class SearchModel
    {
        public List<Filter>? ColumnFilter { get; set; }
        public Search? ValueSearch { get; set; }
    }
    public class Filter
    {
        public string? ColumnName { get; set; }
        public string? ColumnValue { get; set; }
        public string? ColumnValueType { get; set; }
    }

    public class Search
    {
        public string? SearchValueType { get; set; }
        public string? SearchValue { get; set; }
        public List<string>? SearchColumnList { get; set; }
    }

    public class OrderByColumn
    {
        public string ColumnName { get; set; }
        public bool IsDescending { get; set; }
    }
}
